"use client";

import { QuizContainer } from "@/components/evaluations/quiz-container";
import { evaluacionAvanzada } from "@/components/evaluations/data/advanced-evaluation";

export default function AdvancedEvaluation() {
  return (
        <QuizContainer quizData={evaluacionAvanzada} />
  );
} 