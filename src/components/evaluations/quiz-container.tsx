"use client"

import { useState } from "react"
import { QuizIntro } from "./quiz-intro"
import { QuizQuestion } from "./quiz-question"
import { UserInfoForm, type UserInfo } from "./user-info-form"
import { ResultsReady } from "./results-ready"
import { CybersecurityResults } from "./cybersecurity-results"
import type { QuizData, QuizResults } from "../types"

interface QuizContainerProps {
  quizData: QuizData
}

type QuizStage = "intro" | "questions" | "user-info" | "results-ready" | "results"

export function QuizContainer({ quizData }: QuizContainerProps) {
  const [stage, setStage] = useState<QuizStage>("intro")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [results, setResults] = useState<QuizResults>({})
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

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
      setStage("user-info")
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleUserInfoSubmit = (info: UserInfo) => {
    setUserInfo(info)
    setStage("results-ready")
  }

  const handleViewResults = () => {
    setStage("results")
  }

  const handleRestart = () => {
    setResults({})
    setCurrentQuestionIndex(0)
    setUserInfo(null)
    setStage("intro")
  }

  return (
    <>
      {stage === "intro" && <QuizIntro quizData={quizData} onStart={handleStart} />}

      {stage === "questions" && (
        <QuizQuestion
          question={quizData.questions[currentQuestionIndex]}
          currentIndex={currentQuestionIndex}
          totalQuestions={quizData.questions.length}
          selectedValue={results[quizData.questions[currentQuestionIndex].id] || null}
          onSelect={handleSelect}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}

      {stage === "user-info" && <UserInfoForm results={results} onSubmit={handleUserInfoSubmit} />}

      {stage === "results-ready" && userInfo && (
        <ResultsReady userInfo={userInfo} onViewResults={handleViewResults} shareUrl={window.location.href} />
      )}

      {stage === "results" && userInfo && (
        <CybersecurityResults quizData={quizData} results={results} userInfo={userInfo} onRestart={handleRestart} />
      )}
    </>
  )
}

