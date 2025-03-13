import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getEvaluationById } from "@/lib/evaluation-utils";
import { CybersecurityResults } from "@/components/evaluations/cybersecurity-results";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";
import { getQuizData } from "@/lib/quiz-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Download } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { UserInfo } from "@/components/evaluations/types";

// Update the interface to match Next.js expected types for dynamic routes
interface EvaluationPageProps {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({ params }: EvaluationPageProps) {
  try {
    const { id } = params;
    const evaluation = await getEvaluationById(id);

    if (!evaluation) {
      return {
        title: "Evaluación no encontrada",
      };
    }

    return {
      title: `${evaluation.title} | Dashboard`,
      description: `Resultados de la evaluación de ciberseguridad para ${evaluation.profile.firstName || "Usuario"}`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error al cargar evaluación",
    };
  }
}

export default async function EvaluationPage({ params }: EvaluationPageProps) {
  try {
    const { id } = params;
    const evaluation = await getEvaluationById(id);

    if (!evaluation) {
      notFound();
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

    // Format the date
    const formattedDate = format(
      new Date(evaluation.createdAt),
      "d 'de' MMMM 'de' yyyy",
      { locale: es }
    );

    return (
      <div className="container py-8">
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
                {formattedDate}
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </div>

        <Suspense
          fallback={<SecurityLoadingScreen message="Cargando resultados..." />}
        >
          <CybersecurityResults
            quizData={quizData}
            results={answers}
            userInfo={userInfo}
            isSharedView={false}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error loading evaluation:", error);
    return (
      <div className="container py-8">
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
