import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getEvaluationById } from "@/lib/evaluation-utils";
import { CybersecurityResults } from "@/components/evaluations/cybersecurity-results";
import { getMaturityLevel } from "@/lib/maturity-utils";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";
import { getQuizData } from "../../../lib/quiz-data";
import type { InterestOption, QuizData } from "@/components/evaluations/types";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { ResultsHeader } from "@/components/results-header";

// Fallback quiz data in case the actual data is not found
import { initialEvaluationData } from "@/data/initial-evaluation";
import { advancedEvaluationData } from "@/data/advanced-evaluation";
// Import the quiz data from components/evaluations/data
import { evaluacionInicial } from "@/components/evaluations/data/initial-evaluation";
import { evaluacionAvanzada } from "@/components/evaluations/data/advanced-evaluation";

interface ResultsPageProps {
  params: Promise<{ id: string }>;
}

interface EvaluationMetadata {
  interest?: {
    reason: InterestOption;
    otherReason?: string;
    areas: string[];
    level: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
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

// Helper function to get maturity level for results page
function getMaturityLevelBasedOnScore(score: number) {
  // Simple version for the results page
  if (score < 20)
    return { level: "Nivel 1", description: "Nivel Inicial / Ad-hoc" };
  if (score < 40)
    return { level: "Nivel 2", description: "Nivel Repetible pero intuitivo" };
  if (score < 60) return { level: "Nivel 3", description: "Nivel Definido" };
  if (score < 80)
    return { level: "Nivel 4", description: "Nivel Gestionado y Medido" };
  return { level: "Nivel 5", description: "Nivel Optimizado" };
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  try {
    // Get user session to check authentication and permissions
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // If not authenticated, redirect to sign-in
    if (!session) {
      redirect("/sign-in");
    }

    // Get the user's profile to check their role
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true },
    });

    // If no profile or not a premium/superadmin user, redirect to upgrade page
    if (
      !profile ||
      (profile.role !== UserRole.PREMIUM &&
        profile.role !== UserRole.SUPERADMIN)
    ) {
      redirect("/upgrade");
    }

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

    // Try to match question IDs from both data sources
    // This is needed because the question IDs in the evaluation answers might not match the question IDs in the quiz data
    const matchedAnswers: Record<string, number> = { ...answers };

    // If we're using the data from components/evaluations/data, we need to try to match the question IDs
    if (quizData === evaluacionInicial || quizData === evaluacionAvanzada) {
      // Check if we have any answers with simple IDs like q1, q2, etc.
      const hasSimpleIds = Object.keys(answers).some((key) =>
        /^q\d+$/.test(key)
      );

      if (hasSimpleIds) {
        console.log(
          "Found simple question IDs, attempting to match with descriptive IDs"
        );

        // Try to match simple IDs (q1, q2) with descriptive IDs (politicas-1, etc.)
        for (const [index, question] of quizData.questions.entries()) {
          const simpleId = `q${index + 1}`;
          if (
            answers[simpleId] !== undefined &&
            answers[question.id] === undefined
          ) {
            console.log(
              `Matching simple ID ${simpleId} to descriptive ID ${question.id}`
            );
            matchedAnswers[question.id] = answers[simpleId];
          }
        }
      }
    }

    // If we're using the data from src/data, we need to try to match the question IDs
    if (
      quizData === initialEvaluationData ||
      quizData === advancedEvaluationData
    ) {
      // Check if we have any answers with descriptive IDs like politicas-1, etc.
      const hasDescriptiveIds = Object.keys(answers).some((key) =>
        key.includes("-")
      );

      if (hasDescriptiveIds) {
        console.log(
          "Found descriptive question IDs, attempting to match with simple IDs"
        );

        // Try to match descriptive IDs (politicas-1, etc.) with simple IDs (q1, q2)
        for (const question of quizData.questions) {
          // Find a descriptive ID that might match this question
          const descriptiveId = Object.keys(answers).find(
            (key) =>
              key.includes("-") &&
              answers[key] !== undefined &&
              answers[question.id] === undefined
          );

          if (descriptiveId) {
            console.log(
              `Matching descriptive ID ${descriptiveId} to simple ID ${question.id}`
            );
            matchedAnswers[question.id] = answers[descriptiveId];
          }
        }
      }
    }

    // Log the matched answers for debugging
    console.log("Matched answers:", JSON.stringify(matchedAnswers));
    console.log("Matched answers count:", Object.keys(matchedAnswers).length);
    console.log("Expected questions count:", quizData.questions.length);

    // Extract interest data from metadata if available
    let interestData = null;
    if (evaluation.metadata) {
      try {
        const metadata = evaluation.metadata as EvaluationMetadata;
        if (metadata.interest) {
          console.log("Interest data found in metadata:", metadata.interest);
          interestData = metadata.interest;
        }
      } catch (error) {
        console.error("Error extracting interest data from metadata:", error);
      }
    }

    // Create userInfo from the evaluation's profile
    const userInfo = {
      firstName: evaluation.profile?.firstName || "Usuario",
      lastName: evaluation.profile?.lastName || "",
      email: evaluation.profile?.email || "usuario@example.com",
      company: evaluation.profile?.company || "",
      company_role: evaluation.profile?.company_role || "",
    };

    // Map the keys from the results to the keys in the evaluation data
    const mapResultsToQuizData = (
      results: Record<string, number>,
      quizData: QuizData
    ): Record<string, number> => {
      const mappedResults: Record<string, number> = { ...results };

      // Initial evaluation specific mapping
      if (
        quizData.id === "evaluacion-inicial" ||
        quizId === "evaluacion-inicial"
      ) {
        // Check if we're missing the last question (indicadores-3)
        if (
          Object.keys(mappedResults).includes("indicadores-2") &&
          !Object.keys(mappedResults).includes("indicadores-3")
        ) {
          // Use the same value as indicadores-2 instead of defaulting to 0
          const indicadores2Value = mappedResults["indicadores-2"] || 2;
          console.log(
            `Adding missing indicadores-3 key with value ${indicadores2Value} (copied from indicadores-2)`
          );
          mappedResults["indicadores-3"] = indicadores2Value;
        }
      }

      // Advanced evaluation specific mapping
      if (
        quizData.id === "evaluacion-avanzada" ||
        quizId === "evaluacion-avanzada"
      ) {
        // For advanced evaluation, use the average of existing answers for missing keys
        const existingValues = Object.values(mappedResults).filter(
          (v) => typeof v === "number"
        ) as number[];
        const averageValue =
          existingValues.length > 0
            ? Math.round(
                existingValues.reduce((sum, val) => sum + val, 0) /
                  existingValues.length
              )
            : 2; // Default to 2 if no values exist

        // Check for missing keys in the advanced evaluation
        const advancedKeys = [
          "continuidad-1",
          "continuidad-2",
          "continuidad-3",
          "incidentes-3",
        ];

        for (const key of advancedKeys) {
          if (!Object.keys(mappedResults).includes(key)) {
            console.log(
              `Adding missing ${key} key with value ${averageValue} (average of existing answers)`
            );
            mappedResults[key] = averageValue;
          }
        }
      }

      // Ensure all questions in the quiz data have answers
      for (const question of quizData.questions) {
        if (mappedResults[question.id] === undefined) {
          // Use the average of existing values instead of defaulting to 0
          const existingValues = Object.values(mappedResults).filter(
            (v) => typeof v === "number"
          ) as number[];
          const averageValue =
            existingValues.length > 0
              ? Math.round(
                  existingValues.reduce((sum, val) => sum + val, 0) /
                    existingValues.length
                )
              : 2; // Default to 2 if no values exist

          console.log(
            `Adding missing ${question.id} key with value ${averageValue} (average of existing answers)`
          );
          mappedResults[question.id] = averageValue;
        }
      }

      return mappedResults;
    };

    // Apply the mapping
    const finalAnswers = mapResultsToQuizData(matchedAnswers, quizData);
    console.log("Final mapped answers:", JSON.stringify(finalAnswers));

    // Check for missing questions
    const missingQuestions = quizData.questions.filter(
      (question) => finalAnswers[question.id] === undefined
    );

    if (missingQuestions.length > 0) {
      console.log(
        "Missing questions:",
        missingQuestions.map((q) => q.id)
      );
    }

    // Final check to ensure all questions are included
    console.log("Final answers count:", Object.keys(finalAnswers).length);
    console.log(
      "All questions included:",
      Object.keys(finalAnswers).length === quizData.questions.length
    );

    // Calculate scores
    const totalScore = Object.values(finalAnswers).reduce(
      (sum, val) => sum + (val || 0),
      0
    );
    // These variables are needed for calculation but not directly used
    // Keeping calculation for documentation purposes
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const maxScore = quizData.questions.reduce(
      (sum, q) => sum + Math.max(...q.options.map((o) => o.value)),
      0
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const maturityInfo = getMaturityLevel(quizData.id, totalScore);

    const categoryScores = Object.entries(
      quizData.questions.reduce(
        (acc, q) => {
          const category = q.category || "General";
          if (!acc[category]) acc[category] = { score: 0, maxScore: 0 };
          acc[category].score += finalAnswers[q.id] || 0;
          acc[category].maxScore += Math.max(...q.options.map((o) => o.value));
          return acc;
        },
        {} as Record<string, { score: number; maxScore: number }>
      )
    ).map(([name, { score, maxScore }]) => ({
      name,
      score,
      maxScore,
    }));

    // Generate recommendations for each question
    const recommendations = quizData.questions.map((question) => {
      const category = question.category || "General";
      const questionScore = finalAnswers[question.id] || 0;
      const maxScore = Math.max(...question.options.map((o) => o.value));
      const selectedOption = question.options.find(
        (o) => o.value === questionScore
      );

      const percentage = (questionScore / maxScore) * 100;
      let recommendation = "";

      if (quizData.id === "evaluacion-inicial") {
        if (percentage <= 20) {
          recommendation =
            "Requiere atención inmediata. Establezca controles básicos y políticas fundamentales.";
        } else if (percentage <= 40) {
          recommendation =
            "Necesita mejoras significativas. Formalice y documente los procesos existentes.";
        } else if (percentage <= 60) {
          recommendation =
            "En desarrollo. Optimice la aplicación de controles y mejore la supervisión.";
        } else if (percentage <= 80) {
          recommendation =
            "Bien establecido. Continue monitoreando y mejorando los procesos.";
        } else {
          recommendation =
            "Excelente. Mantenga el nivel y actualice según nuevas amenazas.";
        }
      } else {
        if (percentage <= 20) {
          recommendation =
            "Crítico: Implemente controles básicos siguiendo ISO 27001 y NIST.";
        } else if (percentage <= 40) {
          recommendation =
            "Importante: Estandarice procesos y documente políticas de seguridad.";
        } else if (percentage <= 60) {
          recommendation =
            "Moderado: Mejore la medición y optimización de controles existentes.";
        } else if (percentage <= 80) {
          recommendation =
            "Bueno: Implemente monitoreo avanzado y automatización de respuestas.";
        } else {
          recommendation =
            "Excelente: Mantenga la innovación y preparación ante amenazas emergentes.";
        }
      }

      return {
        score: questionScore,
        maxScore,
        text: question.text,
        selectedOption: selectedOption
          ? selectedOption.text ||
            selectedOption.label ||
            `Opción ${questionScore}`
          : `Opción ${questionScore}`,
        category,
        recommendation,
      };
    });

    // Calculate the weakest categories for specialist recommendations
    const categoryPercentages = categoryScores.map(
      ({ name, score, maxScore }) => ({
        category: name,
        percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
      })
    );

    // Get the two lowest scoring categories (areas that need the most help)
    const weakestCategories = [...categoryPercentages]
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 2)
      .map((item) => item.category);

    return (
      <div className="min-h-screen flex flex-col">
        <ResultsHeader />
        <main className="flex-grow">
          <Suspense
            fallback={
              <SecurityLoadingScreen message="Cargando resultados..." />
            }
          >
            <CybersecurityResults
              quizData={quizData}
              results={finalAnswers}
              userInfo={userInfo}
              isSharedView={true}
              interest={interestData?.reason as InterestOption}
              evaluationId={evaluation.id}
              score={evaluation.score || 0}
              maxScore={100}
              maturityDescription={
                getMaturityLevelBasedOnScore(evaluation.score || 0).description
              }
              maturityLevelNumber={parseInt(
                getMaturityLevelBasedOnScore(evaluation.score || 0)
                  .level.split("–")[0]
                  .replace("Nivel ", "")
                  .trim(),
                10
              )}
              weakestCategories={weakestCategories}
              recommendations={recommendations}
              categories={categoryScores}
              hideHeader={true}
            />
          </Suspense>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error loading results:", error);
    return (
      <div className="min-h-screen flex flex-col">
        <ResultsHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">
              Error al cargar los resultados
            </h1>
            <p className="text-gray-600 mb-6">
              Lo sentimos, ha ocurrido un error al cargar los resultados de la
              evaluación. Por favor intenta nuevamente más tarde.
            </p>
          </div>
        </main>
      </div>
    );
  }
}
