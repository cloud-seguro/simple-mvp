import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EvaluationContent } from "./evaluation-content";
import { getEvaluationData } from "./evaluation-data";

// Update the interface to match Next.js expected types for dynamic routes
interface EvaluationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EvaluationPage({ params }: EvaluationPageProps) {
  try {
    const { id } = await params;
    const data = await getEvaluationData(id);

    if (!data) {
      notFound();
    }

    const { evaluation } = data;

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

        <Suspense
          fallback={<SecurityLoadingScreen message="Cargando resultados..." />}
        >
          <EvaluationContent {...data} />
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
