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

  useEffect(() => {
    setUserInfo({
      firstName: profile?.firstName || "Usuario",
      lastName: profile?.lastName || "",
      email: user?.email || "",
    });
  }, [profile, user]);

  // Check for locally stored results when the component mounts
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !loadedStoredResults.current &&
      Object.keys(results).length === 0
    ) {
      try {
        const storedResults = localStorage.getItem(
          `quiz_results_${quizData.id}`
        );
        if (storedResults) {
          const parsedResults = JSON.parse(storedResults);
          // Only use stored results if we don't have any results yet
          if (parsedResults.results) {
            console.log("Found locally stored results:", parsedResults);
            setResults(parsedResults.results);
            loadedStoredResults.current = true;
          }
        }
      } catch (error) {
        console.error("Error reading stored results:", error);
      }
    }
  }, [quizData.id, results]);

  const handleStart = () => {
    setStage("questions");
  };

  const handleSelect = (value: number) => {
    const questionId = quizData.questions[currentQuestionIndex].id;
    console.log(`Setting answer for question ${questionId} to value ${value}`);

    setResults((prev) => {
      const newResults = {
        ...prev,
        [questionId]: value,
      };

      // Log the updated results for debugging
      console.log("Updated results:", JSON.stringify(newResults));
      return newResults;
    });
  };

  const handleNext = async () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Ensure all questions have answers before submitting
      const updatedResults = { ...results };
      let missingAnswers = false;

      // Check for any missing answers and set default value of 0
      for (const question of quizData.questions) {
        if (updatedResults[question.id] === undefined) {
          console.log(
            `Question ${question.id} has no answer, setting default value 0`
          );
          updatedResults[question.id] = 0;
          missingAnswers = true;
        }
      }

      // Update results if any were missing
      if (missingAnswers) {
        setResults(updatedResults);
      }

      // If user is authenticated, check if they've already answered the interest question
      if (user?.id) {
        // First check if the user has already completed any evaluation before
        try {
          setIsSubmitting(true);
          setLoadingMessage("Verificando datos previos...");

          const response = await fetch("/api/evaluations/user-interest");
          if (response.ok) {
            const data = await response.json();

            // If user has already answered the interest question, use their previous answer
            if (data.hasInterestData && data.interest) {
              setInterest(data.interest);
              // Skip interest stage and directly save the results
              handleSaveResults();
              setIsSubmitting(false);
              return;
            }
          }
          setIsSubmitting(false);
        } catch (error) {
          console.error("Error checking previous interest data:", error);
          setIsSubmitting(false);
        }
      }

      // Move to the interest stage if no previous interest data was found
      setStage("interest");
    }
  };

  const handleInterestSubmit = (
    reason: InterestOption,
    otherReason?: string
  ) => {
    // Save the interest information
    setInterest({
      reason,
      otherReason,
    });

    // If user is already authenticated, skip sign-up and save results directly
    if (user?.id) {
      handleSaveResults();
    } else {
      // Otherwise, go to sign-up
      setStage("sign-up");
    }
  };

  const handleSaveResults = async () => {
    try {
      setIsSubmitting(true);
      setSaveError(null);
      setNeedsProfile(false);
      setLoadingMessage("Verificando perfil de usuario...");

      // Check if the user has a profile
      if (!profile) {
        // Try to fetch the profile directly
        try {
          const profileResponse = await fetch(`/api/profile/${user?.id}`);
          if (!profileResponse.ok) {
            // If the profile doesn't exist, show an error and redirect to profile creation
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

      // Log information about the evaluation being saved
      console.log("Preparing to save evaluation:", {
        type: evaluationType,
        quizId: quizData.id,
        profileId: profile?.id,
        answersCount: Object.keys(results).length,
        interest: interest,
      });

      // Create a complete set of answers, ensuring all questions are included
      const completeAnswers = { ...results };

      // Calculate the average value of existing answers
      const existingValues = Object.values(completeAnswers).filter(
        (v) => typeof v === "number"
      ) as number[];
      const averageValue =
        existingValues.length > 0
          ? Math.round(
              existingValues.reduce((sum, val) => sum + val, 0) /
                existingValues.length
            )
          : 2; // Default to 2 if no values exist

      // Fill in any missing values with the average (should be rare, but just in case)
      quizData.questions.forEach((question) => {
        if (completeAnswers[question.id] === undefined) {
          console.log(
            `Setting missing answer for ${question.id} to average value ${averageValue}`
          );
          completeAnswers[question.id] = averageValue;
        }
      });

      // Try to save locally for backup and later offline review
      try {
        localStorage.setItem(
          `quiz_results_${quizData.id}`,
          JSON.stringify({
            results: completeAnswers,
            timestamp: new Date().toISOString(),
          })
        );
        console.log("Saved results locally for offline backup");
      } catch (saveError) {
        console.error("Could not save results locally:", saveError);
      }

      setLoadingMessage("Guardando resultados de evaluación...");

      // Store evaluation results in the database
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
          userId: user?.id, // Include userId in the request
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

      toast({
        title: "Éxito",
        description: "Los resultados se han guardado correctamente.",
      });

      setStage("results-ready");
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
    } finally {
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
    setResults({});
    setCurrentQuestionIndex(0);
    setStage("intro");
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
    <div className="w-full max-w-3xl mx-auto">
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
        <CybersecurityInterest onSubmit={handleInterestSubmit} />
      )}

      {stage === "sign-up" && (
        <EvaluationSignUp
          results={results}
          quizId={quizData.id}
          onComplete={handleSignUpComplete}
          interest={interest}
        />
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
        <CybersecurityResults
          quizData={quizData}
          results={results}
          userInfo={userInfo}
          onRestart={handleRestart}
          interest={interest}
        />
      )}
    </div>
  );
}
