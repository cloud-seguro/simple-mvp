import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getEvaluationById } from "@/lib/evaluation-utils";
import { CybersecurityResults } from "@/components/evaluations/cybersecurity-results";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";
import { getQuizData } from "../../../lib/quiz-data";
import type { UserInfo } from "@/components/evaluations/types";

// Fallback quiz data in case the actual data is not found
import { initialEvaluationData } from "@/data/initial-evaluation";
import { advancedEvaluationData } from "@/data/advanced-evaluation";

interface ResultsPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ResultsPageProps) {
  try {
    // Use Promise.resolve to ensure params is awaited
    const { id } = await Promise.resolve(params);

    const evaluation = await getEvaluationById(id);

    if (!evaluation) {
      return {
        title: "Resultados no encontrados",
      };
    }

    return {
      title: `Resultados de ${evaluation.title}`,
      description: `Resultados de la evaluación de ciberseguridad para ${evaluation.profile.firstName || "Usuario"}`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error al cargar resultados",
    };
  }
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  try {
    // Use Promise.resolve to ensure params is awaited
    const { id } = await Promise.resolve(params);

    const evaluation = await getEvaluationById(id);

    if (!evaluation) {
      notFound();
    }

    // Get the quiz data based on the evaluation type
    const quizId =
      evaluation.type === "INITIAL"
        ? "evaluacion-inicial"
        : "evaluacion-avanzada";

    // Try to get the quiz data, or use fallback data if not found
    let quizData = getQuizData(quizId);

    if (!quizData) {
      console.warn(
        `Quiz data not found for type: ${evaluation.type}, using fallback data`
      );
      // Use fallback data based on the evaluation type
      quizData =
        evaluation.type === "INITIAL"
          ? initialEvaluationData
          : advancedEvaluationData;
    }

    // Prepare user info
    const userInfo: UserInfo = {
      firstName: evaluation.profile.firstName || "Usuario",
      lastName: evaluation.profile.lastName || "",
      email: evaluation.profile.email || "",
    };

    // Ensure answers is a valid Record<string, number>
    const answers: Record<string, number> = {};

    if (evaluation.answers) {
      // Check if answers is a string (JSON)
      if (typeof evaluation.answers === "string") {
        try {
          const parsedAnswers = JSON.parse(evaluation.answers);
          evaluation.answers = parsedAnswers;
          console.log("Parsed answers from JSON string:", parsedAnswers);
        } catch (e) {
          console.error("Failed to parse answers JSON string:", e);
        }
      }

      // Check if answers is already a Record<string, number>
      if (typeof evaluation.answers === "object") {
        // Log the structure of the answers for debugging
        console.log(
          "Evaluation answers structure:",
          JSON.stringify(evaluation.answers)
        );

        // Convert answers to the correct format if needed
        if (Array.isArray(evaluation.answers)) {
          // If it's an array, convert to object
          for (let index = 0; index < evaluation.answers.length; index++) {
            const answer = evaluation.answers[index] as
              | { id?: string; value?: number }
              | number;
            if (
              answer &&
              typeof answer === "object" &&
              "id" in answer &&
              "value" in answer
            ) {
              answers[answer.id as string] = answer.value as number;
            } else {
              // If it's a simple array of values, use question index as key
              answers[`q${index + 1}`] = Number(answer) || 0;
            }
          }
        } else {
          // If it's already an object, ensure all values are numbers
          for (const [key, value] of Object.entries(
            evaluation.answers as Record<string, unknown>
          )) {
            answers[key] = Number(value) || 0;
          }
        }
      }
    }

    // Log the processed answers for debugging
    console.log("Processed answers:", JSON.stringify(answers));

    return (
      <Suspense
        fallback={<SecurityLoadingScreen message="Cargando resultados..." />}
      >
        <CybersecurityResults
          quizData={quizData}
          results={answers}
          userInfo={userInfo}
          isSharedView={true}
        />
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading evaluation results:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Error al cargar resultados
        </h1>
        <p className="text-center">
          Lo sentimos, ha ocurrido un error al cargar los resultados de la
          evaluación.
        </p>
        <p className="text-center text-gray-600 mt-2">
          Detalles del error:{" "}
          {error instanceof Error ? error.message : String(error)}
        </p>
      </div>
    );
  }
}
