import { initialEvaluationData } from "@/data/initial-evaluation";
import { advancedEvaluationData } from "@/data/advanced-evaluation";
import type { QuizData } from "@/components/evaluations/types";

/**
 * Get quiz data by ID
 * @param quizId - The ID of the quiz
 * @returns The quiz data or undefined if not found
 */
export function getQuizData(quizId: string): QuizData | undefined {
  switch (quizId) {
    case "evaluacion-inicial":
      return initialEvaluationData;
    case "evaluacion-avanzada":
      return advancedEvaluationData;
    default:
      return undefined;
  }
}
