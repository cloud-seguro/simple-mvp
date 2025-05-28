import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvaluationById } from "@/lib/evaluation-utils";
import { getQuizData } from "@/lib/quiz-data";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";
import { Button } from "@/components/ui/button";
import { ComparePageClient } from "./compare-client";

export const dynamic = "force-dynamic";

interface ComparePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    first?: string;
    second?: string;
    sortOrder?: "asc" | "desc";
  }>;
}

export const metadata = {
  title: "Comparar Evaluaciones | Dashboard",
  description: "Compara los resultados de dos evaluaciones de ciberseguridad",
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  try {
    const { first, second, sortOrder = "desc" } = await searchParams;

    if (!first || !second) {
      return (
        <div className="w-full py-8">
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
        <div className="w-full py-8">
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

    const evaluationType = firstEvaluation.type;

    // Get the quiz data based on the evaluation type
    const quizId =
      evaluationType === "INITIAL"
        ? "evaluacion-inicial"
        : "evaluacion-avanzada";

    // Get the quiz data
    const quizData = getQuizData(quizId);

    if (!quizData) {
      throw new Error(`Quiz data not found for type: ${evaluationType}`);
    }

    // Prepare sort context for display
    const sortOrderLabel =
      sortOrder === "asc"
        ? "Más antigua a más reciente"
        : "Más reciente a más antigua";

    return (
      <Suspense
        fallback={<SecurityLoadingScreen message="Cargando comparación..." />}
      >
        <ComparePageClient
          firstEvaluation={firstEvaluation}
          secondEvaluation={secondEvaluation}
          quizData={quizData}
          sortOrderLabel={sortOrderLabel}
          evaluationType={evaluationType}
        />
      </Suspense>
    );
  } catch (error) {
    console.error("Error comparing evaluations:", error);
    return (
      <div className="w-full py-8">
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
