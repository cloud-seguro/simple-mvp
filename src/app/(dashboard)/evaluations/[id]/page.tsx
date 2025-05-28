import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EvaluationContent } from "./evaluation-content";
import { getEvaluationData } from "./evaluation-data";
import { prisma } from "@/lib/prisma";
import { getMaturityLevel } from "@/lib/maturity-utils";
import { getQuizData } from "@/lib/quiz-data";

// Update the interface to match Next.js expected types for dynamic routes
interface EvaluationPageProps {
  params: Promise<{ id: string }>;
}

// Fetch detailed evaluation data directly from database instead of API
async function getDetailedEvaluationData(id: string) {
  try {
    // Get the evaluation
    const evaluation = await prisma.evaluation.findUnique({
      where: { id },
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!evaluation) {
      return null;
    }

    // Get the quiz data based on evaluation type
    const quizId =
      evaluation.type === "INITIAL"
        ? "evaluacion-inicial"
        : "evaluacion-avanzada";
    const quizData = getQuizData(quizId);

    if (!quizData) {
      throw new Error("Quiz data not found");
    }

    // Parse the answers
    let answers: Record<string, number> = {};
    if (evaluation.answers) {
      if (typeof evaluation.answers === "string") {
        try {
          answers = JSON.parse(evaluation.answers);
        } catch (err) {
          console.error("Error parsing answers:", err);
        }
      } else if (typeof evaluation.answers === "object") {
        answers = evaluation.answers as Record<string, number>;
      }
    }

    // Calculate max possible score based on evaluation type
    const maxScore = evaluation.type === "INITIAL" ? 45 : 100;

    // Handle score conversion for initial evaluations
    // Old evaluations stored scores as percentages (0-100)
    // New evaluations store raw scores (0-45 for initial, 0-100 for advanced)
    let score = evaluation.score || 0;

    if (evaluation.type === "INITIAL") {
      // If the score is greater than 45, it's likely a percentage from the old system
      // Convert it back to raw score
      if (score > maxScore) {
        // Convert percentage back to raw score
        // Calculate actual score from answers to get the correct raw score
        const actualRawScore = Object.values(answers).reduce(
          (sum, value) => sum + value,
          0
        );
        score = actualRawScore;
        console.log(
          `Converted old percentage score ${evaluation.score} to raw score ${score} for initial evaluation`
        );
      }
    }

    // Calculate maturity level based on capped score
    const maturity = getMaturityLevel(quizId, score);

    // Calculate scores by category
    const categoryScores = Object.entries(
      quizData.questions.reduce(
        (acc, q) => {
          const category = q.category || "General";
          if (!acc[category]) acc[category] = { score: 0, maxScore: 0 };
          acc[category].score += answers[q.id] || 0;
          acc[category].maxScore += Math.max(...q.options.map((o) => o.value));
          return acc;
        },
        {} as Record<string, { score: number; maxScore: number }>
      )
    ).map(([name, { score, maxScore }]) => {
      // For initial evaluations, ensure category scores don't exceed their maximum
      if (evaluation.type === "INITIAL" && score > maxScore) {
        score = maxScore;
      }
      return { name, score, maxScore };
    });

    // Calculate the weakest categories
    const categoryPercentages = categoryScores.map(
      ({ name, score, maxScore }) => ({
        category: name,
        percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
      })
    );

    // Get the two lowest scoring categories
    const weakestCategories = [...categoryPercentages]
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 2)
      .map((item) => item.category);

    // Generate recommendations for each question
    const recommendations = quizData.questions.map((question) => {
      const category = question.category || "General";
      const questionScore = answers[question.id] || 0;
      const maxScore = Math.max(...question.options.map((o) => o.value));
      const selectedOption = question.options.find(
        (o) => o.value === questionScore
      );

      const percentage = (questionScore / maxScore) * 100;
      let recommendation = "";

      if (quizId === "evaluacion-inicial") {
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

    return {
      id: evaluation.id,
      score,
      maxScore,
      maturityDescription: maturity.description,
      maturityLevelNumber: parseInt(maturity.level.replace("Nivel ", "")),
      weakestCategories,
      recommendations,
      categories: categoryScores,
    };
  } catch (error) {
    console.error("Error getting detailed evaluation data:", error);
    throw error;
  }
}

export default async function EvaluationPage({ params }: EvaluationPageProps) {
  try {
    const { id } = await params;
    const data = await getEvaluationData(id);

    if (!data) {
      notFound();
    }

    // Get detailed data directly from the database
    const detailedData = await getDetailedEvaluationData(id);

    if (!detailedData) {
      throw new Error("Could not load detailed evaluation data");
    }

    const { evaluation } = data;

    return (
      <div className="w-full py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Link href="/evaluations">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">{evaluation.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                {format(
                  new Date(evaluation.createdAt),
                  "d 'de' MMMM 'de' yyyy",
                  {
                    locale: es,
                  }
                )}
              </div>
            </div>
          </div>
        </div>

        <EvaluationContent
          {...data}
          evaluation={{
            ...evaluation,
            createdAt: evaluation.createdAt.toISOString(),
          }}
          evaluationData={detailedData}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading evaluation:", error);
    return (
      <div className="w-full py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error al cargar la evaluación
          </h2>
          <p className="text-center">
            Lo sentimos, ha ocurrido un error al cargar los resultados de la
            evaluación.
          </p>
          <p className="text-center text-gray-600 mt-2">
            Detalles del error:{" "}
            {error instanceof Error ? error.message : String(error)}
          </p>
          <div className="mt-6">
            <Link href="/evaluations">
              <Button>Volver a Evaluaciones</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
