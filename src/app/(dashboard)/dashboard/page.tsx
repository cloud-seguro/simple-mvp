import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardCharts } from "./components/dashboard-charts";
import { RecentEvaluations } from "./components/recent-evaluations";
import { RecommendationsList } from "./components/recommendations-list";
import { Button } from "@/components/ui/button";
import { GitCompareIcon, PlusCircle } from "lucide-react";

// Define a simple type for evaluations
type SimpleEvaluation = {
  id: string;
  type: string;
  title: string;
  score: number | null;
  profileId: string;
  createdAt: Date;
  completedAt: Date | null;
};

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get the user's profile for name and evaluations
  // We don't need to check role here as it's already checked in the layout
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { id: true, firstName: true, lastName: true },
  });

  if (!profile) {
    // This shouldn't happen since we check in the layout, but just in case
    redirect("/upgrade");
  }

  // Get the user's evaluations with a type assertion
  const evaluations = (await prisma.$queryRaw`
    SELECT id, type, title, score, "profileId", "createdAt", "completedAt"
    FROM evaluations
    WHERE "profileId" = ${profile.id}
    ORDER BY "createdAt" DESC
  `) as SimpleEvaluation[];

  // Get only the 5 most recent evaluations for the dashboard
  const recentEvaluations = evaluations.slice(0, 5);

  // Calculate category scores for chart data
  // This is a simplified example - in a real app, you'd query this data from the database
  const categoryScores = [
    { name: "Políticas", score: 65 },
    { name: "Acceso", score: 78 },
    { name: "Seguridad", score: 42 },
    { name: "Respuesta", score: 85 },
    { name: "Cumplimiento", score: 60 },
  ];

  // Calculate score over time data
  const scoreOverTime = evaluations
    .filter((evaluation) => evaluation.score !== null)
    .map((evaluation) => ({
      date: new Date(evaluation.createdAt).toLocaleDateString("es-ES", {
        month: "short",
        year: "numeric",
      }),
      score: evaluation.score,
    }))
    .slice(0, 10)
    .reverse();

  // Mock recommendations based on scores
  const recommendations = [
    {
      id: "rec1",
      category: "Seguridad",
      title: "Implementar autenticación de dos factores",
      priority: "Alta",
    },
    {
      id: "rec2",
      category: "Políticas",
      title: "Actualizar política de contraseñas",
      priority: "Media",
    },
    {
      id: "rec3",
      category: "Acceso",
      title: "Revisar permisos de usuarios",
      priority: "Alta",
    },
    {
      id: "rec4",
      category: "Respuesta",
      title: "Crear plan de respuesta a incidentes",
      priority: "Media",
    },
  ];

  const userName = profile.firstName
    ? `${profile.firstName} ${profile.lastName || ""}`
    : "Usuario";

  return (
    <div className="space-y-8">
      <DashboardHeader userName={userName} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <DashboardCharts
            type="category"
            data={categoryScores}
            title="Puntuación por Categoría"
            description="Análisis de tus puntuaciones por área"
          />
        </div>
        <div className="col-span-1">
          <DashboardCharts
            type="score"
            data={scoreOverTime}
            title="Evolución de Puntuación"
            description="Progreso de tus evaluaciones en el tiempo"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RecentEvaluations evaluations={recentEvaluations} />
        </div>
        <div>
          <RecommendationsList recommendations={recommendations} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/evaluations/new">
          <Button className="w-full sm:w-auto gap-2">
            <PlusCircle className="h-4 w-4" />
            Nueva Evaluación
          </Button>
        </Link>
        {evaluations.length >= 2 && (
          <Link href="/evaluations">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <GitCompareIcon className="h-4 w-4" />
              Comparar Evaluaciones
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
