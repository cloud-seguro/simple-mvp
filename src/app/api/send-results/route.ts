import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ResultsEmail } from "@/components/emails/results-email";
import { getEvaluationById } from "@/lib/evaluation-utils";
import { getQuizData } from "@/lib/quiz-data";
import { initialEvaluationData } from "@/data/initial-evaluation";
import { advancedEvaluationData } from "@/data/advanced-evaluation";
import { evaluacionInicial } from "@/components/evaluations/data/initial-evaluation";
import { evaluacionAvanzada } from "@/components/evaluations/data/advanced-evaluation";
import { getMaturityLevel } from "@/lib/maturity-utils";

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { userInfo, evaluationId, email } = await request.json();

    // Validate the required fields
    if (!userInfo || !evaluationId || !email) {
      return NextResponse.json(
        { error: "Missing required fields: userInfo, evaluationId, or email" },
        { status: 400 }
      );
    }

    // Get the evaluation data
    const evaluation = await getEvaluationById(evaluationId);
    if (!evaluation) {
      return NextResponse.json(
        { error: "Evaluation not found" },
        { status: 404 }
      );
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
      // If answers is a string (JSON), parse it
      if (typeof evaluation.answers === "string") {
        try {
          const parsedAnswers = JSON.parse(evaluation.answers);
          evaluation.answers = parsedAnswers;
        } catch (e) {
          console.error("Failed to parse answers JSON string:", e);
        }
      }

      // Convert answers to the correct format if needed
      if (typeof evaluation.answers === "object") {
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

    // Apply the same mapping logic as in the results page
    // to ensure all questions have answers
    const finalAnswers: Record<string, number> = { ...answers };
    for (const question of quizData.questions) {
      if (finalAnswers[question.id] === undefined) {
        // Use the average of existing values instead of defaulting to 0
        const existingValues = Object.values(finalAnswers).filter(
          (v) => typeof v === "number"
        ) as number[];
        const averageValue =
          existingValues.length > 0
            ? Math.round(
                existingValues.reduce((sum, val) => sum + val, 0) /
                  existingValues.length
              )
            : 2; // Default to 2 if no values exist
        finalAnswers[question.id] = averageValue;
      }
    }

    // Calculate category scores
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

    // Get the base URL for links in the email
    // Use VERCEL_URL, NEXT_PUBLIC_VERCEL_URL, or fall back to development URL
    let baseUrl = "http://localhost:3000";

    // Check for Vercel deployment URLs
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      // This is a Vercel preview deployment
      baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    } else if (process.env.VERCEL_URL) {
      // This is a Vercel production deployment
      baseUrl = `https://${process.env.VERCEL_URL}`;
    }
    // Use custom domain if available (in production)
    else if (process.env.NEXT_PUBLIC_SITE_URL) {
      baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    }

    // Get maturity level info
    function getMaturityLevelBasedOnScore(score: number) {
      if (score < 20)
        return { level: "Nivel 1", description: "Nivel Inicial / Ad-hoc" };
      if (score < 40)
        return {
          level: "Nivel 2",
          description: "Nivel Repetible pero intuitivo",
        };
      if (score < 60)
        return { level: "Nivel 3", description: "Nivel Definido" };
      if (score < 80)
        return { level: "Nivel 4", description: "Nivel Gestionado y Medido" };
      return { level: "Nivel 5", description: "Nivel Optimizado" };
    }

    const maturityInfo = getMaturityLevelBasedOnScore(evaluation.score || 0);

    // Send the email with the actual results
    const { data, error } = await resend.emails.send({
      from: "Evaluación de Ciberseguridad <onboarding@resend.dev>",
      to: [email],
      subject: "Sus resultados de evaluación de ciberseguridad están listos",
      react: ResultsEmail({
        userInfo,
        evaluationId,
        baseUrl,
        score: evaluation.score || 0,
        maxScore: 100,
        maturityLevel: maturityInfo.level,
        maturityDescription: maturityInfo.description,
        categories: categoryScores,
        recommendations: recommendations,
      }),
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in send-results API:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
