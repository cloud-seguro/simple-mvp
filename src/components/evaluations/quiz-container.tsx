"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/providers/auth-provider";
import { QuizIntro } from "./quiz-intro";
import { QuizQuestion } from "./quiz-question";
import { ResultsReady } from "./results-ready";
import { CybersecurityResults } from "./cybersecurity-results";
import { getMaturityLevel } from "@/lib/maturity-utils";
import { EvaluationSignUp } from "./evaluation-sign-up";
import { CybersecurityInterest } from "./cybersecurity-interest";
import { EmailCollection } from "./email-collection";
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
  | "email-collection"
  | "sign-up"
  | "results-ready"
  | "results";

export function QuizContainer({ quizData }: QuizContainerProps) {
  const [stage, setStage] = useState<QuizStage>("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<QuizResults>({});
  const { user, isLoading, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Guardando resultados..."
  );
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "Usuario",
    lastName: "",
    email: "",
  });
  const router = useRouter();
  const [evaluationId, setEvaluationId] = useState<string | null>(null);
  const [interest, setInterest] = useState<CybersecurityInterestType | null>(
    null
  );

  // Add state to track if interaction is allowed
  const [isInteractionDisabled, setIsInteractionDisabled] = useState(false);

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

  // This function handles the option selection
  const handleSelect = (value: number) => {
    if (isInteractionDisabled) return;

    // Disable interactions to prevent rapid selections
    setIsInteractionDisabled(true);

    // Record the answer
    const questionId = quizData.questions[currentQuestionIndex].id;
    setResults((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // The QuizQuestion component will call handleNext after selection
  };

  // Function to move to the next question
  const handleNext = async () => {
    if (
      isInteractionDisabled &&
      currentQuestionIndex < quizData.questions.length - 1
    ) {
      // If we're just moving to the next question, we don't need to check again
      setCurrentQuestionIndex((prev) => prev + 1);

      // Re-enable interactions after animation completes
      setTimeout(() => {
        setIsInteractionDisabled(false);
      }, 500);
      return;
    }

    if (isInteractionDisabled) return;
    setIsInteractionDisabled(true);

    try {
      if (currentQuestionIndex < quizData.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);

        // Re-enable interactions after a delay to allow animations to complete
        setTimeout(() => {
          setIsInteractionDisabled(false);
        }, 500);
      } else {
        // Set submitting state
        setIsSubmitting(true);
        setLoadingMessage("Preparando siguiente paso...");

        try {
          // Check if this is an initial or advanced evaluation
          const isInitialEvaluation = quizData.id === "evaluacion-inicial";

          // For advanced evaluations, skip the interest stage completely
          if (!isInitialEvaluation) {
            console.log("Advanced evaluation - skipping interest stage");
            setIsSubmitting(false);

            // If user is logged in, save results with default interest
            if (user && profile) {
              const defaultInterestData = {
                reason: "advanced",
                otherReason: "Evaluación avanzada de ciberseguridad",
              };
              await handleSaveResults(defaultInterestData);
            } else {
              // For non-logged in users, go to email collection
              setStage("email-collection");
              setIsInteractionDisabled(false);
            }
            return; // Exit early to avoid executing the code below
          }

          // Only for initial evaluations - show interest stage
          setIsSubmitting(false);
          setStage("interest");
          setIsInteractionDisabled(false);
        } catch (error) {
          console.error("Error preparing next step:", error);
          setIsSubmitting(false);
          setIsInteractionDisabled(false);

          // Even in case of error, maintain the same flow rules
          if (quizData.id === "evaluacion-inicial") {
            setStage("interest");
          } else {
            // For advanced evaluations, go to email collection if not logged in
            if (!user || !profile) {
              setStage("email-collection");
            } else {
              // Try to save with default interest data as a fallback
              try {
                const defaultInterestData = {
                  reason: "advanced",
                  otherReason: "Evaluación avanzada de ciberseguridad",
                };
                await handleSaveResults(defaultInterestData);
              } catch (innerError) {
                console.error(
                  "Error saving with default interest:",
                  innerError
                );
                setStage("email-collection");
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
      setIsInteractionDisabled(false);
    }
  };

  const handleInterestSubmit = async (
    reason: InterestOption,
    otherReason?: string
  ) => {
    if (isInteractionDisabled) return;
    setIsInteractionDisabled(true);

    setIsSubmitting(true);
    setLoadingMessage("Guardando información...");

    // Create the interest data object
    const interestData = {
      reason,
      otherReason,
    };

    // Update the state
    setInterest(interestData);

    try {
      // If user is logged in, continue with saving
      if (user && profile) {
        await handleSaveResults(interestData);
      } else {
        // Otherwise, go to email collection first
        setIsSubmitting(false);
        setStage("email-collection");
        setIsInteractionDisabled(false);
      }
    } catch (error) {
      console.error("Error in handleInterestSubmit:", error);
      setIsSubmitting(false);
      setIsInteractionDisabled(false);

      // If error is related to user not being logged in, go to email collection
      setStage("email-collection");
    }
  };

  const handleEmailSubmit = async (email: string) => {
    if (isInteractionDisabled) return;
    setIsInteractionDisabled(true);

    try {
      setIsSubmitting(true);
      setLoadingMessage("Guardando resultados...");

      // Update the user info with the provided email
      setUserInfo((prev) => ({
        ...prev,
        email,
      }));

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

      // Determine evaluation type
      const evaluationType =
        quizData.id === "evaluacion-inicial" ? "INITIAL" : "ADVANCED";

      // Ensure we have interest data (or create default)
      const finalInterestData = interest || {
        reason: evaluationType === "INITIAL" ? "general" : "advanced",
        otherReason:
          evaluationType === "INITIAL"
            ? "Evaluación inicial de ciberseguridad"
            : "Evaluación avanzada de ciberseguridad",
      };

      // Send the data to the guest evaluation endpoint
      const response = await fetch("/api/evaluations/guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          type: evaluationType,
          title:
            evaluationType === "INITIAL"
              ? "Evaluación Inicial"
              : "Evaluación Avanzada",
          answers: completeAnswers,
          interest: finalInterestData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar los resultados");
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
        description: "Los resultados se han enviado a tu correo electrónico.",
      });

      // Transition to results-ready stage
      setStage("results-ready");

      // Remove loading state after a short delay
      setTimeout(() => {
        setIsSubmitting(false);
        setIsInteractionDisabled(false);
      }, 500);
    } catch (error) {
      console.error("Error submitting guest evaluation:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al guardar los resultados",
        variant: "destructive",
      });
      setIsSubmitting(false);
      setIsInteractionDisabled(false);
    }
  };

  const handleSaveResults = async (
    interestData?: CybersecurityInterestType
  ) => {
    try {
      // Keep or set submitting state
      setIsSubmitting(true);
      setLoadingMessage("Verificando perfil de usuario...");

      // Check if the user has a profile
      if (!profile) {
        try {
          const profileResponse = await fetch(`/api/profile/${user?.id}`);
          if (!profileResponse.ok) {
            throw new Error(
              "No se encontró un perfil para este usuario. Por favor, complete su perfil primero."
            );
          }
        } catch (profileError) {
          console.error("Profile check error:", profileError);
          toast({
            title: "Perfil incompleto",
            description:
              "Necesita completar su perfil antes de guardar los resultados de la evaluación.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          setIsInteractionDisabled(false);
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

      // Use the passed interest data or fall back to the state
      const finalInterestData = interestData || interest;

      // Ensure we have interest data
      if (!finalInterestData) {
        throw new Error(
          "Se requiere información sobre el interés en la evaluación"
        );
      }

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
          interest: finalInterestData,
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
        setIsInteractionDisabled(false);
      }, 500);
    } catch (error) {
      console.error("Error saving evaluation:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al guardar los resultados de la evaluación",
        variant: "destructive",
      });
      setIsSubmitting(false);
      setIsInteractionDisabled(false);
    }
  };

  const handlePrev = () => {
    if (isInteractionDisabled) return;
    setIsInteractionDisabled(true);

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }

    // Re-enable interactions after a delay
    setTimeout(() => {
      setIsInteractionDisabled(false);
    }, 500);
  };

  const handleSignUpComplete = (savedEvaluationId?: string) => {
    if (savedEvaluationId) {
      setEvaluationId(savedEvaluationId);
    }
    setStage("results-ready");
    setIsInteractionDisabled(false);
  };

  const handleViewResults = () => {
    if (isInteractionDisabled) return;
    setIsInteractionDisabled(true);

    if (evaluationId) {
      // Redirect to the results page
      router.push(`/results/${evaluationId}`);
    } else {
      // If we don't have an evaluation ID (e.g., when using localStorage results),
      // fall back to the old behavior
      setStage("results");
      setIsInteractionDisabled(false);
    }
  };

  const handleRestart = () => {
    if (isInteractionDisabled) return;
    setIsInteractionDisabled(true);

    // Reset all states to their initial values
    setResults({});
    setCurrentQuestionIndex(0);
    setStage("intro");
    setInterest(null);
    setEvaluationId(null);
    setIsSubmitting(false);
    setLoadingMessage("Guardando resultados...");
    // Clear local storage for this quiz
    try {
      localStorage.removeItem(`quiz_results_${quizData.id}`);
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }

    // Re-enable interactions after a delay
    setTimeout(() => {
      setIsInteractionDisabled(false);
    }, 500);
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
          disabled={isInteractionDisabled}
        />
      )}

      {stage === "interest" && quizData.id === "evaluacion-inicial" && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <CybersecurityInterest onSubmit={handleInterestSubmit} />
        </div>
      )}

      {stage === "email-collection" && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <EmailCollection onEmailSubmit={handleEmailSubmit} />
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
            interest={interest?.reason as InterestOption}
            evaluationId={evaluationId || undefined}
            isSharedView={false}
            score={Object.values(results).reduce(
              (sum, val) => sum + (val || 0),
              0
            )}
            maxScore={
              quizData.id === "evaluacion-inicial"
                ? 45 // Initial eval is out of 45
                : 75 // Advanced eval is out of 75
            }
            maturityDescription={
              getMaturityLevel(
                quizData.id,
                Object.values(results).reduce((sum, val) => sum + (val || 0), 0)
              ).description
            }
            categories={Object.entries(
              quizData.questions.reduce(
                (acc, q) => {
                  const category = q.category || "General";
                  if (!acc[category]) acc[category] = { score: 0, maxScore: 0 };
                  acc[category].score += results[q.id] || 0;
                  acc[category].maxScore += Math.max(
                    ...q.options.map((o) => o.value)
                  );
                  return acc;
                },
                {} as Record<string, { score: number; maxScore: number }>
              )
            ).map(([name, { score, maxScore }]) => ({
              name,
              score,
              maxScore,
            }))}
            weakestCategories={Object.entries(
              quizData.questions.reduce(
                (acc, q) => {
                  const category = q.category || "General";
                  if (!acc[category]) acc[category] = { score: 0, maxScore: 0 };
                  acc[category].score += results[q.id] || 0;
                  acc[category].maxScore += Math.max(
                    ...q.options.map((o) => o.value)
                  );
                  return acc;
                },
                {} as Record<string, { score: number; maxScore: number }>
              )
            )
              .map(([name, { score, maxScore }]) => ({
                category: name,
                percentage: Math.round((score / maxScore) * 100),
              }))
              .sort((a, b) => a.percentage - b.percentage)
              .slice(0, 2)
              .map((item) => item.category)}
            maturityLevelNumber={parseInt(
              getMaturityLevel(
                quizData.id,
                Object.values(results).reduce((sum, val) => sum + (val || 0), 0)
              )
                .level.split("–")[0]
                .replace("Nivel ", "")
                .trim(),
              10
            )}
          />
        </div>
      )}
    </div>
  );
}
