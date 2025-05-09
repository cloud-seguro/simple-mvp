"use client";

import { useState, useEffect } from "react";
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

    // For advanced evaluations, skip email collection and interest steps
    if (quizData.id !== "evaluacion-inicial") {
      // Set default interest data for advanced evaluations
      const defaultInterestData = {
        reason: "advanced" as InterestOption,
        otherReason: "Evaluación avanzada de ciberseguridad",
      };
      setInterest(defaultInterestData);

      // If user is logged in, we already have their email
      if (user && user.email) {
        setUserInfo((prev) => ({
          ...prev,
          email: user.email || "",
        }));
        setStage("questions");
      } else {
        // If not logged in, we still need to collect email
        setStage("email-collection");
      }
    } else {
      // For initial evaluations, follow the new flow: email -> interest -> questions
      setStage("email-collection");
    }
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
        setLoadingMessage("Preparando resultados...");

        try {
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

          // Ensure we have interest data
          if (!interest) {
            throw new Error("Falta información de interés");
          }

          // If user is logged in, save results
          if (user && profile) {
            await handleSaveResults(interest);
          } else {
            // For users who provided email but aren't logged in
            if (userInfo.email) {
              // Send the data to the guest evaluation endpoint
              const response = await fetch("/api/evaluations/guest", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: userInfo.email,
                  type: evaluationType,
                  title:
                    evaluationType === "INITIAL"
                      ? "Evaluación Inicial"
                      : "Evaluación Avanzada",
                  answers: completeAnswers,
                  interest: interest,
                }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  errorData.message || "Error al guardar los resultados"
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
                description:
                  "Los resultados se han enviado a tu correo electrónico.",
              });

              // Transition to results-ready stage
              setStage("results-ready");
            } else {
              throw new Error("Falta información de email");
            }
          }

          // Remove loading state after a short delay
          setTimeout(() => {
            setIsSubmitting(false);
            setIsInteractionDisabled(false);
          }, 500);
        } catch (error) {
          console.error("Error preparing results:", error);
          setIsSubmitting(false);
          setIsInteractionDisabled(false);

          // In case of error, transition to results-ready if we have minimum data
          if (userInfo.email && interest) {
            setStage("results-ready");
          } else if (!userInfo.email) {
            // If missing email, go back to email collection
            setStage("email-collection");
            toast({
              title: "Información faltante",
              description: "Necesitamos su correo electrónico para continuar.",
              variant: "destructive",
            });
          } else if (!interest) {
            // If missing interest data, go back to interest stage
            setStage("interest");
            toast({
              title: "Información faltante",
              description: "Por favor, indíquenos su interés para continuar.",
              variant: "destructive",
            });
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

    // Now move to questions stage after collecting interest
    setIsSubmitting(false);
    setStage("questions");
    setIsInteractionDisabled(false);
  };

  const handleEmailSubmit = async (email: string) => {
    if (isInteractionDisabled) return;
    setIsInteractionDisabled(true);

    try {
      setIsSubmitting(true);
      setLoadingMessage("Guardando información...");

      // Update the user info with the provided email
      setUserInfo((prev) => ({
        ...prev,
        email,
      }));

      // For advanced evaluations, we can skip the interest step
      if (quizData.id !== "evaluacion-inicial") {
        // Set default interest data
        const defaultInterestData = {
          reason: "advanced" as InterestOption,
          otherReason: "Evaluación avanzada de ciberseguridad",
        };
        setInterest(defaultInterestData);

        // Go directly to questions
        setIsSubmitting(false);
        setStage("questions");
        setIsInteractionDisabled(false);
      } else {
        // For initial evaluations, go to interest collection
        setIsSubmitting(false);
        setStage("interest");
        setIsInteractionDisabled(false);
      }
    } catch (error) {
      console.error("Error submitting email:", error);
      toast({
        title: "Error",
        description:
          "No pudimos procesar tu email. Por favor, intenta nuevamente.",
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

      // Always transition to results-ready stage
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

  // Quiz loading skeleton
  const QuizLoadingSkeleton = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-4xl p-6 space-y-4">
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-4"></div>
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
        <div className="h-32 w-full bg-gray-200 animate-pulse rounded my-8"></div>
        <div className="flex justify-between items-center mt-8">
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
        {loadingMessage && (
          <div className="text-center text-sm text-muted-foreground mt-4">
            {loadingMessage}
          </div>
        )}
      </div>
    </div>
  );

  // Quiz processing overlay
  const QuizProcessingOverlay = () => (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg space-y-4">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center">
          <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mx-auto mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded mx-auto"></div>
        </div>
        {loadingMessage && (
          <div className="text-center text-sm text-muted-foreground mt-2">
            {loadingMessage}
          </div>
        )}
      </div>
    </div>
  );

  // If auth is still loading, show the loading skeleton
  if (isLoading) {
    return <QuizLoadingSkeleton />;
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {isSubmitting && <QuizProcessingOverlay />}

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

      {stage === "interest" && (
        <CybersecurityInterest onSubmit={handleInterestSubmit} />
      )}

      {stage === "email-collection" && (
        <EmailCollection onEmailSubmit={handleEmailSubmit} />
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
          evaluationType={
            quizData.id === "evaluacion-inicial" ? "INITIAL" : "ADVANCED"
          }
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
            isSharedView={false}
            score={Object.values(results).reduce(
              (sum, val) => sum + (val || 0),
              0
            )}
            maxScore={
              quizData.id === "evaluacion-inicial"
                ? 45 // Initial eval is out of 45
                : 100 // Advanced eval is out of 100
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
