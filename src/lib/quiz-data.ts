import { initialEvaluationData } from "@/data/initial-evaluation";
import { advancedEvaluationData } from "@/data/advanced-evaluation";
import { evaluacionInicial } from "@/components/evaluations/data/initial-evaluation";
import { evaluacionAvanzada } from "@/components/evaluations/data/advanced-evaluation";
import type { QuizData } from "@/components/evaluations/types";

/**
 * Get quiz data by ID
 * @param quizId - The ID of the quiz
 * @returns The quiz data or undefined if not found
 */
export function getQuizData(quizId: string): QuizData | undefined {
  switch (quizId) {
    case "evaluacion-inicial":
      // Try to use the data from components/evaluations/data first
      return evaluacionInicial || initialEvaluationData;
    case "evaluacion-avanzada":
      // Try to use the data from components/evaluations/data first
      return evaluacionAvanzada || advancedEvaluationData;
    default:
      return undefined;
  }
}
