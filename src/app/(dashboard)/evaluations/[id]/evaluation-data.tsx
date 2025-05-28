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

  // Calculate max possible score based on evaluation type
  const maxScore = evaluation.type === "INITIAL" ? 45 : 100;

  // Handle score conversion for initial evaluations
  // Old evaluations stored scores as percentages (0-100)
  // New evaluations store raw scores (0-45 for initial, 0-100 for advanced)
  let cappedScore = evaluation.score || 0;

  if (evaluation.type === "INITIAL") {
    // If the score is greater than 45, it's likely a percentage from the old system
    // Convert it back to raw score
    if (cappedScore > maxScore) {
      // Convert percentage back to raw score
      // Calculate actual score from answers to get the correct raw score
      const actualRawScore = Object.values(answers).reduce(
        (sum, value) => sum + value,
        0
      );
      cappedScore = actualRawScore;
      console.log(
        `Converted old percentage score ${evaluation.score} to raw score ${cappedScore} for initial evaluation`
      );
    }
  }

  // Prepare user info
  const userInfo: UserInfo = {
    firstName: evaluation.profile?.firstName || "Usuario",
    lastName: evaluation.profile?.lastName || "",
    email: evaluation.profile?.email || "",
  };

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
