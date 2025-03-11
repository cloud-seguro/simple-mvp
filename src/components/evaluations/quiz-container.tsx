"use client"

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { QuizIntro } from "./quiz-intro";
import { QuizQuestion } from "./quiz-question";
import { ResultsReady } from "./results-ready";
import { CybersecurityResults } from "./cybersecurity-results";
import { EvaluationSignUp } from "./evaluation-sign-up";
import type { QuizData, QuizResults, UserInfo } from "./types";
import { toast } from "@/components/ui/use-toast";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";

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
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "Usuario",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    setUserInfo({
      firstName: profile?.firstName || "Usuario",
      lastName: profile?.lastName || "",
      email: user?.email || "",
    });
  }, [profile, user]);

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

    // Add a longer delay before moving to the results-ready stage
    // This ensures that all auth processes are completed
    setTimeout(async () => {
      // If we have a user ID but no profile, try to fetch it directly
      if (user?.id && !profile) {
        try {
          setIsSubmitting(true); // Show loading screen while fetching profile

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
        } finally {
          setIsSubmitting(false);
        }
      }

      // Move to the results-ready stage
      setStage("results-ready");
    }, 2000); // Increased from 1000ms to 2000ms
  };

  const handleViewResults = () => {
    setStage("results");
  };

  const handleRestart = () => {
    setResults({});
    setCurrentQuestionIndex(0);
    setStage("intro");
  };

  // If auth is still loading, show the security loading screen
  if (isLoading) {
    return <SecurityLoadingScreen message="Verificando sesión..." />;
  }

  return (
    <>
      {isSubmitting && (
        <SecurityLoadingScreen
          variant="overlay"
          message="Guardando resultados..."
        />
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

