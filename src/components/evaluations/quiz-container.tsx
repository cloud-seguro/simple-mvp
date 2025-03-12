"use client"

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/providers/auth-provider";
import { QuizIntro } from "./quiz-intro";
import { QuizQuestion } from "./quiz-question";
import { ResultsReady } from "./results-ready";
import { CybersecurityResults } from "./cybersecurity-results";
import { EvaluationSignUp } from "./evaluation-sign-up";
import type { QuizData, QuizResults, UserInfo } from "./types";
import { toast } from "@/components/ui/use-toast";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";
import { useRouter } from "next/navigation";

interface QuizContainerProps {
  quizData: QuizData;
}

type QuizStage =
  | "intro"
  | "questions"
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
    setResults((prev) => ({
      ...prev,
      [quizData.questions[currentQuestionIndex].id]: value,
    }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // If user is already authenticated, skip sign-up and save results directly
      if (user?.id) {
        try {
          setIsSubmitting(true);
          setSaveError(null);
          setNeedsProfile(false);
          setLoadingMessage("Verificando perfil de usuario...");

          // Check if the user has a profile
          if (!profile) {
            // Try to fetch the profile directly
            try {
              const profileResponse = await fetch(`/api/profile/${user.id}`);
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
          });

          // Implement retry logic for saving evaluation results
          let success = false;
          let retryCount = 0;
          const maxRetries = 3;
          let lastError = null;
          let savedEvaluationId = null;

          while (!success && retryCount < maxRetries) {
            try {
              setLoadingMessage(
                `Guardando resultados (intento ${retryCount + 1}/${maxRetries})...`
              );

              // Check if we have the profile ID
              if (!profile?.id) {
                throw new Error(
                  "No se encontró el perfil del usuario. Por favor, complete su perfil primero."
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
                  answers: results,
                  profileId: profile.id, // Use profileId instead of userId
                }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                console.error("API error response:", errorData);

                // Check for specific error conditions
                if (response.status === 403 && evaluationType === "ADVANCED") {
                  throw new Error(
                    "Se requiere una suscripción premium para realizar evaluaciones avanzadas."
                  );
                }

                throw new Error(
                  errorData.error ||
                    "Error al guardar los resultados de la evaluación"
                );
              }

              const data = await response.json();
              savedEvaluationId = data.evaluation.id;
              success = true;
            } catch (error) {
              console.error(`Attempt ${retryCount + 1} failed:`, error);
              lastError = error;
              retryCount++;

              if (retryCount < maxRetries) {
                // Wait before retrying (increasing delay with each retry)
                setLoadingMessage(
                  `Reintentando guardar resultados (${retryCount}/${maxRetries})...`
                );
                // Exponential backoff for retries
                await new Promise((resolve) =>
                  setTimeout(resolve, 1000 * 1.5 ** retryCount)
                );
              }
            }
          }

          if (!success) {
            const errorMessage =
              lastError instanceof Error
                ? lastError.message
                : "Error al guardar los resultados de la evaluación";

            // Check for specific error messages to provide better user feedback
            if (
              errorMessage.includes("premium") ||
              errorMessage.includes("Premium")
            ) {
              setSaveError(
                new Error(
                  "Se requiere una suscripción premium para realizar evaluaciones avanzadas."
                )
              );
              toast({
                title: "Suscripción requerida",
                description:
                  "Se requiere una suscripción premium para realizar evaluaciones avanzadas.",
                variant: "destructive",
              });
            } else if (
              errorMessage.includes("perfil") ||
              errorMessage.includes("Profile")
            ) {
              setSaveError(
                new Error(
                  "No se encontró un perfil para este usuario. Por favor, complete su perfil primero."
                )
              );
              setNeedsProfile(true);
              toast({
                title: "Perfil incompleto",
                description:
                  "Necesita completar su perfil antes de guardar los resultados de la evaluación.",
                variant: "destructive",
              });
            } else {
              setSaveError(
                lastError instanceof Error ? lastError : new Error(errorMessage)
              );
              toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
              });
            }

            setIsSubmitting(false);
            return;
          }

          // Add a small delay before proceeding to ensure everything is properly saved
          setLoadingMessage("¡Listo! Preparando resultados...");
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Store the evaluation ID for the results page
          if (savedEvaluationId) {
            setEvaluationId(savedEvaluationId);
          }

          // Move to the results-ready stage
          setStage("results-ready");
        } catch (error) {
          console.error("Error saving evaluation:", error);
          setSaveError(
            error instanceof Error ? error : new Error("Unknown error")
          );
          toast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Hubo un problema al guardar tus resultados. Por favor, inténtalo de nuevo más tarde.",
            variant: "destructive",
          });
          // Don't automatically move to results-ready on error
          // Let the user try again or manually proceed
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setStage("sign-up");
      }
    }
  };

  // Function to retry saving the evaluation
  const handleRetrySave = () => {
    handleNext();
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSignUpComplete = (savedEvaluationId?: string) => {
    // Clear any potential loading states
    setIsSubmitting(false);

    // Store the evaluation ID if provided
    if (savedEvaluationId) {
      setEvaluationId(savedEvaluationId);
    }

    // Show loading screen while we wait for profile to be available
    setIsSubmitting(true);
    setLoadingMessage("Verificando sesión y perfil...");

    // Add a longer delay before moving to the results-ready stage
    // This ensures that all auth processes are completed
    setTimeout(async () => {
      // If we have a user ID but no profile, try to fetch it directly
      if (user?.id && !profile) {
        try {
          setLoadingMessage("Obteniendo datos de perfil...");
          // Try to fetch the profile directly
          const response = await fetch(`/api/profile/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            // Update the userInfo state with the fetched profile data
            if (data.profile) {
              setUserInfo({
                firstName: data.profile.firstName || "Usuario",
                lastName: data.profile.lastName || "",
                email: user.email || "",
                // Additional fields if needed
              });
            }
          }
        } catch (error) {
          console.error(
            "Error fetching profile before showing results:",
            error
          );
        }
      }

      // Move to the results-ready stage
      setLoadingMessage("Preparando resultados...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStage("results-ready");
      // Clear the loading state
      setIsSubmitting(false);
    }, 2000); // Increased from 1000ms to 2000ms
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
    <>
      {isSubmitting && (
        <SecurityLoadingScreen variant="overlay" message={loadingMessage} />
      )}

      {stage === "intro" && (
        <QuizIntro quizData={quizData} onStart={handleStart} />
      )}

      {stage === "questions" &&
        (needsProfile ? (
          <div className="flex flex-col items-center justify-center p-8 gap-4">
            <h2 className="text-2xl font-bold text-amber-600">
              Perfil incompleto
            </h2>
            <p className="text-center mb-4">
              Para guardar los resultados de la evaluación, necesita completar
              su perfil primero.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleGoToProfile}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Ir a mi perfil
              </button>
              <button
                type="button"
                onClick={handleContinueWithoutSaving}
                className="px-6 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90"
              >
                Continuar sin guardar
              </button>
            </div>
          </div>
        ) : saveError ? (
          <div className="flex flex-col items-center justify-center p-8 gap-4">
            <h2 className="text-2xl font-bold text-red-600">
              Error al guardar resultados
            </h2>
            <p className="text-center mb-4">
              {saveError.message ||
                "Hubo un problema al guardar tus resultados."}
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleRetrySave}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Intentar de nuevo
              </button>
              <button
                type="button"
                onClick={handleContinueWithoutSaving}
                className="px-6 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90"
              >
                Continuar sin guardar
              </button>
            </div>
          </div>
        ) : (
          <QuizQuestion
            question={quizData.questions[currentQuestionIndex]}
            currentIndex={currentQuestionIndex}
            totalQuestions={quizData.questions.length}
            selectedValue={
              results[quizData.questions[currentQuestionIndex].id] || null
            }
            onSelect={handleSelect}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        ))}

      {stage === "sign-up" && !user?.id && (
        <EvaluationSignUp
          results={results}
          quizId={quizData.id}
          onComplete={handleSignUpComplete}
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
        />
      )}
    </>
  );
}

