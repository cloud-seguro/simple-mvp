import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardCharts } from "./components/dashboard-charts";
import { RecentEvaluations } from "./components/recent-evaluations";
import { RecommendationsList } from "./components/recommendations-list";
import { EvaluationType } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define a simple type for evaluations
type SimpleEvaluation = {
  id: string;
  type: EvaluationType;
  title: string;
  score: number | null;
  profileId: string;
  createdAt: Date;
  completedAt: Date | null;
  answers: Record<string, number | string>; // Replace any with a more specific type
};

// Categories from evaluations
const initialCategories = [
  "Políticas de Seguridad",
  "Identificación de Activos y Procesos",
  "SGSI y Controles Básicos",
  "Formación y Cultura de Seguridad",
  "Indicadores, Continuidad e Incidentes",
];

const advancedCategories = [
  "Políticas, Normativas y Gobernanza",
  "Identificación de Activos y Gestión de Riesgos",
  "Controles Técnicos y Protección de Infraestructura",
  "Monitoreo, Auditoría y Respuesta a Incidentes",
  "Seguridad en Desarrollo y Aplicaciones",
  "Seguridad en Redes y Defensa Activa",
  "Ingeniería Social y Resiliencia",
  "Gestión de Incidentes y Resiliencia",
  "Continuidad del Negocio y Protección de la Información",
];

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
    SELECT id, type, title, score, "profileId", "createdAt", "completedAt", answers
    FROM evaluations
    WHERE "profileId" = ${profile.id}
    ORDER BY "createdAt" DESC
  `) as SimpleEvaluation[];

  // Get only the 5 most recent evaluations for the dashboard
  const recentEvaluations = evaluations.slice(0, 5);

  // Separate evaluations by type
  const initialEvaluations = evaluations.filter(
    (evaluation) => evaluation.type === "INITIAL"
  );

  const advancedEvaluations = evaluations.filter(
    (evaluation) => evaluation.type === "ADVANCED"
  );

  // Calculate category scores for initial evaluations
  const initialCategoryScores = calculateCategoryScores(
    initialEvaluations,
    initialCategories
  );

  // Calculate category scores for advanced evaluations
  const advancedCategoryScores = calculateCategoryScores(
    advancedEvaluations,
    advancedCategories
  );

  // Calculate score over time data for initial evaluations
  const initialScoreOverTime = initialEvaluations
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

  // Calculate score over time data for advanced evaluations
  const advancedScoreOverTime = advancedEvaluations
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

  // Process the latest evaluations to generate recommendations
  const latestInitial = initialEvaluations[0];
  const latestAdvanced = advancedEvaluations[0];

  // Generate recommendations based on scores
  const recommendations = generateRecommendations(
    latestInitial,
    latestAdvanced
  );

  const userName = profile.firstName
    ? `${profile.firstName} ${profile.lastName || ""}`
    : "Usuario";

  // Check if user has multiple evaluations for comparison
  const hasMultipleInitialEvals = initialEvaluations.length >= 2;
  const hasMultipleAdvancedEvals = advancedEvaluations.length >= 2;
  const hasMultipleEvaluations =
    hasMultipleInitialEvals || hasMultipleAdvancedEvals;

  // Determine which tab to show as default
  const defaultTab = advancedEvaluations.length > 0 ? "advanced" : "initial";
  const hasEvaluations =
    initialEvaluations.length > 0 || advancedEvaluations.length > 0;

  return (
    <div className="space-y-8">
      <DashboardHeader
        userName={userName}
        hasMultipleEvaluations={hasMultipleEvaluations}
      />

      {hasEvaluations ? (
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-[400px] mb-6">
            <TabsTrigger
              value="initial"
              disabled={initialEvaluations.length === 0}
            >
              Evaluación Inicial
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              disabled={advancedEvaluations.length === 0}
            >
              Evaluación Avanzada
            </TabsTrigger>
          </TabsList>

          <TabsContent value="initial" className="space-y-6">
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              style={{ minHeight: "400px" }}
            >
              <div className="col-span-1 h-full">
                <DashboardCharts
                  type="category"
                  data={initialCategoryScores}
                  title="Puntuación por Categoría"
                  description="Análisis de sus puntuaciones por área (Evaluación Inicial)"
                />
              </div>
              {initialScoreOverTime.length > 1 && (
                <div className="col-span-1 h-full">
                  <DashboardCharts
                    type="score"
                    data={initialScoreOverTime}
                    title="Evolución de Puntuación"
                    description="Progreso de sus evaluaciones iniciales en el tiempo"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              style={{ minHeight: "400px" }}
            >
              <div className="col-span-1 h-full">
                <DashboardCharts
                  type="category"
                  data={advancedCategoryScores}
                  title="Puntuación por Categoría"
                  description="Análisis de sus puntuaciones por área (Evaluación Avanzada)"
                />
              </div>
              {advancedScoreOverTime.length > 1 && (
                <div className="col-span-1 h-full">
                  <DashboardCharts
                    type="score"
                    data={advancedScoreOverTime}
                    title="Evolución de Puntuación"
                    description="Progreso de sus evaluaciones avanzadas en el tiempo"
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="py-10 text-center">
          <h3 className="text-xl font-medium mb-2">
            No hay evaluaciones disponibles
          </h3>
          <p className="text-gray-500">
            Realice una evaluación para ver sus análisis aquí
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-full">
          <RecentEvaluations evaluations={recentEvaluations} />
        </div>
        <div className="h-full">
          <RecommendationsList recommendations={recommendations} />
        </div>
      </div>
    </div>
  );
}

// Function to calculate category scores based on evaluation answers
function calculateCategoryScores(
  evaluations: SimpleEvaluation[],
  categories: string[]
) {
  if (evaluations.length === 0) {
    return categories.map((name) => ({ name, score: 0 }));
  }

  // Make sure we're using the most recent evaluation (they are already sorted by createdAt DESC)
  const latestEvaluation = evaluations[0];

  if (!latestEvaluation.answers) {
    return categories.map((name) => ({ name, score: 0 }));
  }

  // Question ID prefixes for each category
  const categoryPrefixes: Record<string, string[]> = {
    // Initial evaluation categories
    "Políticas de Seguridad": ["politicas"],
    "Identificación de Activos y Procesos": ["activos"],
    "SGSI y Controles Básicos": ["sgsi"],
    "Formación y Cultura de Seguridad": ["formacion"],
    "Indicadores, Continuidad e Incidentes": ["indicadores"],

    // Advanced evaluation categories
    "Políticas, Normativas y Gobernanza": ["politicas"],
    "Identificación de Activos y Gestión de Riesgos": ["activos"],
    "Controles Técnicos y Protección de Infraestructura": ["controles"],
    "Monitoreo, Auditoría y Respuesta a Incidentes": ["monitoreo"],
    "Seguridad en Desarrollo y Aplicaciones": ["desarrollo"],
    "Seguridad en Redes y Defensa Activa": ["redes"],
    "Ingeniería Social y Resiliencia": ["ingenieria"],
    "Gestión de Incidentes y Resiliencia": ["incidentes"],
    "Continuidad del Negocio y Protección de la Información": ["continuidad"],
  };

  // Group answers by category and calculate scores
  const categoryScores = categories.map((category) => {
    // Find questions by the category prefixes
    const prefixes = categoryPrefixes[category] || [];

    const categoryAnswers = Object.entries(latestEvaluation.answers || {})
      .filter(([key]) => {
        // Skip metadata
        if (key.includes("questionData")) return false;

        // Check if any of the category prefixes match
        return prefixes.some((prefix) => key.startsWith(prefix));
      })
      .map(([, value]) => value as number);

    if (categoryAnswers.length > 0) {
      const totalScore = categoryAnswers.reduce((sum, score) => sum + score, 0);
      const maxPossibleScore = categoryAnswers.length * 3; // Each question has max value of 3
      const avgScore = Math.round((totalScore / maxPossibleScore) * 100);

      return {
        name: category,
        score: avgScore,
      };
    }

    // Fallback for categories with no answers
    return {
      name: category,
      score: 0,
    };
  });

  return categoryScores;
}

// Function to generate recommendations based on evaluation scores
function generateRecommendations(
  latestInitial?: SimpleEvaluation,
  latestAdvanced?: SimpleEvaluation
) {
  const recommendations = [];

  // Add recommendations based on initial evaluation
  if (latestInitial?.answers) {
    // Check policies score
    const policiesQuestions = Object.entries(latestInitial.answers).filter(
      ([key]) => key.startsWith("politicas")
    );

    const policiesAvg =
      policiesQuestions.reduce((sum, [, val]) => sum + (val as number), 0) /
      (policiesQuestions.length || 1);

    if (policiesAvg < 2) {
      recommendations.push({
        id: "rec1",
        category: "Políticas",
        title: "Establecer políticas formales de seguridad",
        priority: "Alta" as const,
      });
    }

    // Check MFA implementation
    const mfaQuestion = latestInitial.answers["sgsi-2"] as number;
    if (mfaQuestion < 2) {
      recommendations.push({
        id: "rec2",
        category: "Seguridad",
        title: "Implementar autenticación de dos factores en sistemas críticos",
        priority: "Alta" as const,
      });
    }

    // Check training
    const trainingQuestions = Object.entries(latestInitial.answers).filter(
      ([key]) => key.startsWith("formacion")
    );

    const trainingAvg =
      trainingQuestions.reduce((sum, [, val]) => sum + (val as number), 0) /
      (trainingQuestions.length || 1);

    if (trainingAvg < 2) {
      recommendations.push({
        id: "rec3",
        category: "Formación",
        title: "Implementar programa regular de capacitación en ciberseguridad",
        priority: "Media" as const,
      });
    }
  }

  // Add recommendations based on advanced evaluation
  if (latestAdvanced?.answers) {
    // Check penetration testing
    const pentestQuestion = latestAdvanced.answers["redes-1"] as number;
    if (pentestQuestion < 2) {
      recommendations.push({
        id: "rec4",
        category: "Redes",
        title:
          "Realizar pruebas de penetración (pentesting) en aplicaciones críticas",
        priority: "Alta" as const,
      });
    }

    // Check incident response
    const incidentQuestion = latestAdvanced.answers["incidentes-1"] as number;
    if (incidentQuestion < 2) {
      recommendations.push({
        id: "rec5",
        category: "Incidentes",
        title: "Desarrollar plan formal de respuesta a incidentes",
        priority: "Media" as const,
      });
    }

    // Check development security
    const devSecQuestion = latestAdvanced.answers["desarrollo-1"] as number;
    if (devSecQuestion < 2) {
      recommendations.push({
        id: "rec6",
        category: "Desarrollo",
        title: "Implementar prácticas DevSecOps y revisión de código",
        priority: "Media" as const,
      });
    }
  }

  // Return up to 4 recommendations
  return recommendations.slice(0, 4);
}
