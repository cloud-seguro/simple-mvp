"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { QuizIntro } from "./quiz-intro";
import { QuizQuestion } from "./quiz-question";
import { ResultsReady } from "./results-ready";
import {
  CybersecurityResults,
  getMaturityLevel,
} from "./cybersecurity-results";
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
      // Set submitting state before showing interest question
      setIsSubmitting(true);
      setLoadingMessage("Preparando siguiente paso...");

      try {
        // Always show the interest question
        setIsSubmitting(false);
        setStage("interest");
      } catch (error) {
        console.error("Error preparing interest question:", error);
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

    // Create the interest data object
    const interestData = {
      reason,
      otherReason,
    };

    // Update the state
    setInterest(interestData);

    try {
      // Pass the interest data directly to handleSaveResults
      await handleSaveResults(interestData);
    } catch (error) {
      console.error("Error in handleInterestSubmit:", error);
      setIsSubmitting(false);
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
    setLoadingMessage("Guardando resultados...");
    // Clear local storage for this quiz
    try {
      localStorage.removeItem(`quiz_results_${quizData.id}`);
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
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
            maturityLevel={
              getMaturityLevel(
                quizData.id,
                Object.values(results).reduce((sum, val) => sum + (val || 0), 0)
              ).level
            }
            maturityDescription={
              getMaturityLevel(
                quizData.id,
                Object.values(results).reduce((sum, val) => sum + (val || 0), 0)
              ).description
            }
            recommendations={quizData.questions.map((question) => {
              const category = question.category || "General";
              const questionScore = results[question.id] || 0;
              const maxScore = Math.max(
                ...question.options.map((o) => o.value)
              );
              const selectedOption = question.options.find(
                (o) => o.value === questionScore
              );

              const percentage = (questionScore / maxScore) * 100;
              let recommendation = "";

              if (quizData.id === "evaluacion-inicial") {
                if (percentage <= 20) {
                  recommendation =
                    "Requiere atención inmediata. Establezca controles básicos y políticas fundamentales.";
                } else if (percentage <= 40) {
                  recommendation =
                    "Necesita mejoras significativas. Formalice y documente los procesos existentes.";
                } else if (percentage <= 60) {
                  recommendation =
                    "En desarrollo. Optimice la aplicación de controles y mejore la supervisión.";
                } else if (percentage <= 80) {
                  recommendation =
                    "Bien establecido. Continue monitoreando y mejorando los procesos.";
                } else {
                  recommendation =
                    "Excelente. Mantenga el nivel y actualice según nuevas amenazas.";
                }
              } else {
                if (percentage <= 20) {
                  recommendation =
                    "Crítico: Implemente controles básicos siguiendo ISO 27001 y NIST.";
                } else if (percentage <= 40) {
                  recommendation =
                    "Importante: Estandarice procesos y documente políticas de seguridad.";
                } else if (percentage <= 60) {
                  recommendation =
                    "Moderado: Mejore la medición y optimización de controles existentes.";
                } else if (percentage <= 80) {
                  recommendation =
                    "Bueno: Implemente monitoreo avanzado y automatización de respuestas.";
                } else {
                  recommendation =
                    "Excelente: Mantenga la innovación y preparación ante amenazas emergentes.";
                }
              }

              return {
                score: questionScore,
                maxScore: maxScore,
                text: question.text,
                selectedOption: selectedOption
                  ? selectedOption.text ||
                    selectedOption.label ||
                    `Opción ${questionScore}`
                  : `Opción ${questionScore}`,
                category: category,
                recommendation: recommendation,
              };
            })}
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
