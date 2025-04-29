import { getEvaluationById } from "@/lib/evaluation-utils";
import { getQuizData } from "@/lib/quiz-data";
import type { UserInfo } from "@/components/evaluations/types";

export async function getEvaluationData(id: string) {
  const evaluation = await getEvaluationById(id);

  if (!evaluation) {
    return null;
  }

  // Get the quiz data based on the evaluation type
  const quizId =
    evaluation.type === "INITIAL"
      ? "evaluacion-inicial"
      : "evaluacion-avanzada";

  // Get the quiz data
  const quizData = getQuizData(quizId);

  if (!quizData) {
    throw new Error(`Quiz data not found for type: ${evaluation.type}`);
  }

  // Calculate max possible score based on evaluation type
  const maxScore = evaluation.type === "INITIAL" ? 45 : 100;

  // Ensure score doesn't exceed max possible score for initial evaluations
  const cappedScore =
    evaluation.type === "INITIAL" && (evaluation.score || 0) > maxScore
      ? maxScore
      : evaluation.score || 0;

  // Prepare user info
  const userInfo: UserInfo = {
    firstName: evaluation.profile?.firstName || "Usuario",
    lastName: evaluation.profile?.lastName || "",
    email: evaluation.profile?.email || "",
  };

  // Ensure answers is a valid Record<string, number>
  const answers: Record<string, number> = {};

  if (evaluation.answers) {
    // Check if answers is a string (JSON)
    if (typeof evaluation.answers === "string") {
      try {
        const parsedAnswers = JSON.parse(evaluation.answers);
        Object.assign(answers, parsedAnswers);
      } catch (e) {
        console.error("Failed to parse answers JSON string:", e);
      }
    } else if (typeof evaluation.answers === "object") {
      // If it's already an object, ensure all values are numbers
      for (const [key, value] of Object.entries(
        evaluation.answers as Record<string, unknown>
      )) {
        answers[key] = Number(value) || 0;
      }
    }
  }

  return {
    evaluation: {
      ...evaluation,
      score: cappedScore,
    },
    quizData,
    answers,
    userInfo,
  };
}
