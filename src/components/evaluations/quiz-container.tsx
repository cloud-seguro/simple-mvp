"use client"

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { QuizIntro } from "./quiz-intro";
import { QuizQuestion } from "./quiz-question";
import { ResultsReady } from "./results-ready";
import { CybersecurityResults } from "./cybersecurity-results";
import { EvaluationSignUp } from "./evaluation-sign-up";
import type { QuizData, QuizResults } from "./types";
import { toast } from "@/components/ui/use-toast";

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
          const evaluationType =
            quizData.id === "evaluacion-inicial" ? "INITIAL" : "ADVANCED";

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
              userId: user.id,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message ||
                "Error al guardar los resultados de la evaluación"
            );
          }

          setStage("results-ready");
        } catch (error) {
          console.error("Error saving evaluation:", error);
          // Still proceed to results-ready, but show an error toast
          toast({
            title: "Error",
            description:
              "Hubo un problema al guardar tus resultados. Por favor, inténtalo de nuevo más tarde.",
            variant: "destructive",
          });
          setStage("results-ready");
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setStage("sign-up");
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSignUpComplete = () => {
    // Clear any potential loading states
    setIsSubmitting(false);
    // Move to the results-ready stage
    setStage("results-ready");
  };

  const handleViewResults = () => {
    setStage("results");
  };

  const handleRestart = () => {
    setResults({});
    setCurrentQuestionIndex(0);
    setStage("intro");
  };

  // Get user info for display
  const userInfo = {
    firstName: profile?.firstName || "Usuario",
    lastName: profile?.lastName || "",
    email: user?.email || "",
  };

  // If auth is still loading, show a loading state
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin" />
              <p className="text-lg font-medium">Guardando resultados...</p>
            </div>
          </div>
        </div>
      )}

      {stage === "intro" && (
        <QuizIntro quizData={quizData} onStart={handleStart} />
      )}

      {stage === "questions" && (
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
      )}

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

