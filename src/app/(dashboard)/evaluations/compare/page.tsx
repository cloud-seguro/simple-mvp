import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvaluationById } from "@/lib/evaluation-utils";
import { getQuizData } from "@/lib/quiz-data";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Download } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EvaluationComparison } from "../components/evaluation-comparison";
import type { UserInfo } from "@/components/evaluations/types";

interface ComparePageProps {
  searchParams: {
    first?: string;
    second?: string;
  };
}

export const metadata = {
  title: "Comparar Evaluaciones | Dashboard",
  description: "Compara los resultados de dos evaluaciones de ciberseguridad",
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  try {
    const { first, second } = searchParams;

    if (!first || !second) {
      return (
        <div className="container py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-4">
              Parámetros de comparación incompletos
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Se requieren dos evaluaciones para realizar la comparación
            </p>
            <Link href="/evaluations">
              <Button>Volver a Evaluaciones</Button>
            </Link>
          </div>
        </div>
      );
    }

    // Get both evaluations
    const [firstEvaluation, secondEvaluation] = await Promise.all([
      getEvaluationById(first),
      getEvaluationById(second),
    ]);

    if (!firstEvaluation || !secondEvaluation) {
      notFound();
    }

    // Check if both evaluations are of the same type
    if (firstEvaluation.type !== secondEvaluation.type) {
      return (
        <div className="container py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-4">
              No se pueden comparar evaluaciones de diferentes tipos
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Solo se pueden comparar evaluaciones del mismo tipo (Inicial o
              Avanzada)
            </p>
            <Link href="/evaluations">
              <Button>Volver a Evaluaciones</Button>
            </Link>
          </div>
        </div>
      );
    }

    // Get the quiz data based on the evaluation type
    const quizId =
      firstEvaluation.type === "INITIAL"
        ? "evaluacion-inicial"
        : "evaluacion-avanzada";

    // Get the quiz data
    const quizData = getQuizData(quizId);

    if (!quizData) {
      throw new Error(`Quiz data not found for type: ${firstEvaluation.type}`);
    }

    // Process answers for both evaluations
    const processAnswers = (answers: unknown): Record<string, number> => {
      const result: Record<string, number> = {};

      if (typeof answers === "string") {
        try {
          const parsedAnswers = JSON.parse(answers);
          Object.assign(result, parsedAnswers);
        } catch (e) {
          console.error("Failed to parse answers JSON string:", e);
        }
      } else if (typeof answers === "object" && answers !== null) {
        for (const [key, value] of Object.entries(
          answers as Record<string, unknown>
        )) {
          result[key] = Number(value) || 0;
        }
      }

      return result;
    };

    const firstAnswers = processAnswers(firstEvaluation.answers);
    const secondAnswers = processAnswers(secondEvaluation.answers);

    // Prepare user info for both evaluations
    const firstUserInfo: UserInfo = {
      firstName: firstEvaluation.profile.firstName || "Usuario",
      lastName: firstEvaluation.profile.lastName || "",
      email: firstEvaluation.profile.email || "",
    };

    const secondUserInfo: UserInfo = {
      firstName: secondEvaluation.profile.firstName || "Usuario",
      lastName: secondEvaluation.profile.lastName || "",
      email: secondEvaluation.profile.email || "",
    };

    // Format dates
    const firstDate = format(
      new Date(firstEvaluation.createdAt),
      "d 'de' MMMM 'de' yyyy",
      { locale: es }
    );

    const secondDate = format(
      new Date(secondEvaluation.createdAt),
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
              <h1 className="text-2xl font-bold">
                Comparación de Evaluaciones
              </h1>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar Comparación
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Comparando evaluaciones del {firstDate} y {secondDate}
            </span>
          </div>
        </div>

        <Suspense
          fallback={<SecurityLoadingScreen message="Cargando comparación..." />}
        >
          <EvaluationComparison
            quizData={quizData}
            firstEvaluation={{
              id: firstEvaluation.id,
              title: firstEvaluation.title,
              date: firstEvaluation.createdAt,
              answers: firstAnswers,
              userInfo: firstUserInfo,
              score: firstEvaluation.score || 0,
            }}
            secondEvaluation={{
              id: secondEvaluation.id,
              title: secondEvaluation.title,
              date: secondEvaluation.createdAt,
              answers: secondAnswers,
              userInfo: secondUserInfo,
              score: secondEvaluation.score || 0,
            }}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error comparing evaluations:", error);
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error al comparar evaluaciones
          </h2>
          <p className="text-center">
            Lo sentimos, ha ocurrido un error al comparar las evaluaciones.
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
