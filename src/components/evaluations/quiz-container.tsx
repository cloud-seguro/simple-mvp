"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/providers/auth-provider";
import { QuizIntro } from "./quiz-intro";
import { QuizQuestion } from "./quiz-question";
import { ResultsReady } from "./results-ready";
import { CybersecurityResults } from "./cybersecurity-results";
import { EvaluationSignUp } from "./evaluation-sign-up";
import { CybersecurityInterest } from "./cybersecurity-interest";
import type {
  QuizData,
  QuizResults,
  UserInfo,
  InterestOption,
  CybersecurityInterest as CybersecurityInterestType,
} from "./types";
import { toast } from "@/components/ui/use-toast";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";
import { useRouter } from "next/navigation";

interface QuizContainerProps {
  quizData: QuizData;
}

type QuizStage =
  | "intro"
  | "questions"
  | "interest"
  | "sign-up"
  | "results-ready"
  | "results";

export function QuizContainer({ quizData }: QuizContainerProps) {
  const [stage, setStage] = useState<QuizStage>("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<QuizResults>({});
  const { user, isLoading, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Guardando resultados..."
  );
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "Usuario",
    lastName: "",
    email: "",
  });
  const router = useRouter();
  const loadedStoredResults = useRef(false);
  const [evaluationId, setEvaluationId] = useState<string | null>(null);
  const [interest, setInterest] = useState<CybersecurityInterestType | null>(
    null
  );

  // Clear any stored results when the component mounts
  useEffect(() => {
    try {
      localStorage.removeItem(`quiz_results_${quizData.id}`);
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  }, [quizData.id]);

  useEffect(() => {
    setUserInfo({
      firstName: profile?.firstName || "Usuario",
      lastName: profile?.lastName || "",
      email: user?.email || "",
    });
  }, [profile, user]);

  const handleStart = () => {
    // Clear any existing results when starting
    setResults({});
    setCurrentQuestionIndex(0);
    setStage("questions");
  };

  const handleSelect = (value: number) => {
    const questionId = quizData.questions[currentQuestionIndex].id;
    setResults((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Set submitting state before checking interest
      setIsSubmitting(true);
      setLoadingMessage("Verificando datos previos...");

      try {
        // If user is authenticated, check if they've already answered the interest question
        if (user?.id) {
          const response = await fetch("/api/evaluations/user-interest");
          if (response.ok) {
            const data = await response.json();
            if (data.hasInterestData && data.interest) {
              setInterest(data.interest);
              // Skip interest stage and directly save the results
              await handleSaveResults();
              return;
            }
          }
        }

        // If no previous interest data was found or user is not authenticated
        setIsSubmitting(false);
        setStage("interest");
      } catch (error) {
        console.error("Error checking previous interest data:", error);
        setIsSubmitting(false);
        setStage("interest");
      }
    }
  };

  const handleInterestSubmit = async (
    reason: InterestOption,
    otherReason?: string
  ) => {
    setIsSubmitting(true);
    setLoadingMessage("Guardando información...");

    // Save the interest information
    setInterest({
      reason,
      otherReason,
    });

    try {
      // If user is already authenticated, immediately save results
      if (user?.id) {
        await handleSaveResults();
      } else {
        // Otherwise, go to sign-up
        setIsSubmitting(false);
        setStage("sign-up");
      }
    } catch (error) {
      console.error("Error in handleInterestSubmit:", error);
      setIsSubmitting(false);
    }
  };

  const handleSaveResults = async () => {
    try {
      // Keep or set submitting state
      setIsSubmitting(true);
      setSaveError(null);
      setNeedsProfile(false);
      setLoadingMessage("Verificando perfil de usuario...");

      // Check if the user has a profile
      if (!profile) {
        try {
          const profileResponse = await fetch(`/api/profile/${user?.id}`);
          if (!profileResponse.ok) {
            setNeedsProfile(true);
            throw new Error(
              "No se encontró un perfil para este usuario. Por favor, complete su perfil primero."
            );
          }
        } catch (profileError) {
          console.error("Profile check error:", profileError);
          setNeedsProfile(true);
          setSaveError(
            profileError instanceof Error
              ? profileError
              : new Error("Error al verificar el perfil")
          );
          toast({
            title: "Perfil incompleto",
            description:
              "Necesita completar su perfil antes de guardar los resultados de la evaluación.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      setLoadingMessage("Preparando datos de evaluación...");
      const evaluationType =
        quizData.id === "evaluacion-inicial" ? "INITIAL" : "ADVANCED";

      // Create a complete set of answers with default values for any missing answers
      const completeAnswers = { ...results };
      const existingValues = Object.values(completeAnswers).filter(
        (v) => typeof v === "number"
      ) as number[];
      const averageValue =
        existingValues.length > 0
          ? Math.round(
              existingValues.reduce((sum, val) => sum + val, 0) /
                existingValues.length
            )
          : 2;

      quizData.questions.forEach((question) => {
        if (completeAnswers[question.id] === undefined) {
          completeAnswers[question.id] = averageValue;
        }
      });

      setLoadingMessage("Guardando resultados de evaluación...");

      const response = await fetch("/api/evaluations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: evaluationType,
          title:
            evaluationType === "INITIAL"
              ? "Evaluación Inicial"
              : "Evaluación Avanzada",
          answers: completeAnswers,
          interest: interest,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "Error al guardar los resultados de la evaluación"
        );
      }

      const data = await response.json();
      setEvaluationId(data.evaluation.id);

      // Clear local storage after successful save
      try {
        localStorage.removeItem(`quiz_results_${quizData.id}`);
      } catch (error) {
        console.error("Error clearing local storage:", error);
      }

      toast({
        title: "Éxito",
        description: "Los resultados se han guardado correctamente.",
      });

      // Keep loading state until we transition to results-ready
      setStage("results-ready");
      // Only remove loading state after a short delay to ensure smooth transition
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      console.error("Error saving evaluation:", error);
      setSaveError(
        error instanceof Error ? error : new Error("Error desconocido")
      );
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al guardar los resultados de la evaluación",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSignUpComplete = (savedEvaluationId?: string) => {
    if (savedEvaluationId) {
      setEvaluationId(savedEvaluationId);
    }
    setStage("results-ready");
  };

  const handleViewResults = () => {
    if (evaluationId) {
      // Redirect to the results page
      router.push(`/results/${evaluationId}`);
    } else {
      // If we don't have an evaluation ID (e.g., when using localStorage results),
      // fall back to the old behavior
      setStage("results");
    }
  };

  const handleRestart = () => {
    // Reset all states to their initial values
    setResults({});
    setCurrentQuestionIndex(0);
    setStage("intro");
    setInterest(null);
    setEvaluationId(null);
    setIsSubmitting(false);
    setSaveError(null);
    setNeedsProfile(false);
    setLoadingMessage("Guardando resultados...");
    // Clear local storage for this quiz
    try {
      localStorage.removeItem(`quiz_results_${quizData.id}`);
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  };

  // Function to redirect to profile page
  const handleGoToProfile = () => {
    router.push("/profile");
  };

  // Function to continue without saving
  const handleContinueWithoutSaving = () => {
    // Store results in localStorage so they can be viewed
    try {
      localStorage.setItem(
        `quiz_results_${quizData.id}`,
        JSON.stringify({
          results,
          timestamp: new Date().toISOString(),
          quizId: quizData.id,
        })
      );

      toast({
        title: "Resultados guardados localmente",
        description:
          "Los resultados se han guardado en su navegador, pero no en su cuenta.",
      });
    } catch (error) {
      console.error("Error saving results to localStorage:", error);
    }

    // Move to the results-ready stage
    setStage("results-ready");
  };

  // If auth is still loading, show the security loading screen
  if (isLoading) {
    return <SecurityLoadingScreen message="Verificando sesión..." />;
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {isSubmitting && (
        <SecurityLoadingScreen
          variant="overlay"
          message={loadingMessage || "Procesando..."}
        />
      )}

      {stage === "intro" && (
        <QuizIntro quizData={quizData} onStart={handleStart} />
      )}

      {stage === "questions" && (
        <QuizQuestion
          question={quizData.questions[currentQuestionIndex]}
          totalQuestions={quizData.questions.length}
          currentIndex={currentQuestionIndex}
          selectedValue={
            results[quizData.questions[currentQuestionIndex].id] ?? null
          }
          onSelect={handleSelect}
          onNext={handleNext}
          onPrev={handlePrev}
          showPrev={currentQuestionIndex > 0}
        />
      )}

      {stage === "interest" && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <CybersecurityInterest onSubmit={handleInterestSubmit} />
        </div>
      )}

      {stage === "sign-up" && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <EvaluationSignUp
            results={results}
            quizId={quizData.id}
            onComplete={handleSignUpComplete}
            interest={interest}
          />
        </div>
      )}

      {stage === "results-ready" && (
        <ResultsReady
          userInfo={userInfo}
          onViewResults={handleViewResults}
          shareUrl={window.location.href}
          evaluationId={evaluationId || undefined}
        />
      )}

      {stage === "results" && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <CybersecurityResults
            quizData={quizData}
            results={results}
            userInfo={userInfo}
            onRestart={handleRestart}
            interest={interest}
          />
        </div>
      )}
    </div>
  );
}
