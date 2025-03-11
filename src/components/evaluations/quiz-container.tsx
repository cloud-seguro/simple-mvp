"use client"

import { useState } from "react"
import { QuizIntro } from "./quiz-intro"
import { QuizQuestion } from "./quiz-question";
import { ResultsReady } from "./results-ready"
import { CybersecurityResults } from "./cybersecurity-results"
import { EvaluationSignUp } from "./evaluation-sign-up";
import type { QuizData, QuizResults } from "./types"

interface QuizContainerProps {
  quizData: QuizData
}

type QuizStage =
  | "intro"
  | "questions"
  | "sign-up"
  | "results-ready"
  | "results";

export function QuizContainer({ quizData }: QuizContainerProps) {
  const [stage, setStage] = useState<QuizStage>("intro")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [results, setResults] = useState<QuizResults>({});

  const handleStart = () => {
    setStage("questions")
  }

  const handleSelect = (value: number) => {
    setResults((prev) => ({
      ...prev,
      [quizData.questions[currentQuestionIndex].id]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setStage("sign-up");
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSignUpComplete = () => {
    setStage("results-ready");
  };

  const handleViewResults = () => {
    setStage("results")
  }

  const handleRestart = () => {
    setResults({})
    setCurrentQuestionIndex(0);
    setStage("intro")
  }

  return (
    <>
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

      {stage === "sign-up" && (
        <EvaluationSignUp
          results={results}
          quizId={quizData.id}
          onComplete={handleSignUpComplete}
        />
      )}

      {stage === "results-ready" && (
        <ResultsReady
          userInfo={{
            firstName: "Usuario",
            lastName: "",
            email: "",
          }}
          onViewResults={handleViewResults}
          shareUrl={window.location.href}
        />
      )}

      {stage === "results" && (
        <CybersecurityResults
          quizData={quizData}
          results={results}
          userInfo={{
            firstName: "Usuario",
            lastName: "",
            email: "",
          }}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}

