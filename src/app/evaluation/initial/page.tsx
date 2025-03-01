"use client";

import { QuizContainer } from "@/components/evaluations/quiz-container";
import { evaluacionInicial } from "@/components/evaluations/data/initial-evaluation";

export default function InitialEvaluation() {
  return <QuizContainer quizData={evaluacionInicial} />;
} 