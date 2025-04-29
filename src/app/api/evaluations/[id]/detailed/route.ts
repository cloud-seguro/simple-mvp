import { type NextRequest, NextResponse } from "next/server";
import {
  withApiAuth,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/middleware/api-authorization";
import { canAccessEvaluation } from "@/lib/auth/permission-checks";
import { prisma } from "@/lib/prisma";
import { getMaturityLevel } from "@/lib/maturity-utils";
import { getQuizData } from "@/lib/quiz-data";

// Type for route handler params
type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: RouteParams) {
  return withApiAuth(req, async (req, user) => {
    try {
      const evaluationId = (await context.params).id;

      // Must be authenticated to access evaluations
      if (!user) {
        return unauthorizedResponse();
      }

      // Check if the user has permission to access this evaluation
      const hasAccess = await canAccessEvaluation(user.id, evaluationId);

      if (!hasAccess) {
        return forbiddenResponse();
      }

      // Get the evaluation
      const evaluation = await prisma.evaluation.findUnique({
        where: { id: evaluationId },
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
        return NextResponse.json(
          { error: "Evaluation not found" },
          { status: 404 }
        );
      }

      // Get the quiz data based on evaluation type
      const quizId =
        evaluation.type === "INITIAL"
          ? "evaluacion-inicial"
          : "evaluacion-avanzada";
      const quizData = getQuizData(quizId);

      if (!quizData) {
        return NextResponse.json(
          { error: "Quiz data not found" },
          { status: 500 }
        );
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

      // Ensure score doesn't exceed max possible score for initial evaluations
      const score =
        evaluation.type === "INITIAL" && (evaluation.score || 0) > maxScore
          ? maxScore
          : evaluation.score || 0;

      // Calculate maturity level based on capped score
      const maturity = getMaturityLevel(quizId, score);

      // Calculate scores by category
      const categoryScores = Object.entries(
        quizData.questions.reduce(
          (acc, q) => {
            const category = q.category || "General";
            if (!acc[category]) acc[category] = { score: 0, maxScore: 0 };
            acc[category].score += answers[q.id] || 0;
            acc[category].maxScore += Math.max(
              ...q.options.map((o) => o.value)
            );
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

      return NextResponse.json({
        id: evaluation.id,
        score,
        maxScore,
        maturityDescription: maturity.description,
        maturityLevelNumber: parseInt(maturity.level.replace("Nivel ", "")),
        weakestCategories,
        recommendations,
        categories: categoryScores,
      });
    } catch (error) {
      console.error("Error in detailed evaluation GET:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
