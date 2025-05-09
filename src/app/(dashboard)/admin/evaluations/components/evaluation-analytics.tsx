"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Evaluation } from "@prisma/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts";
import { Info } from "lucide-react";

// Type for metadata structure
interface GuestMetadata {
  guestInfo?: {
    firstName?: string;
    lastName?: string;
    company?: string;
    phoneNumber?: string;
  };
  interest?: {
    reason?: string;
    otherReason?: string;
  };
}

interface EvaluationWithProfile extends Evaluation {
  profile?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    company: string | null;
  } | null;
  guestFirstName: string | null;
  guestLastName: string | null;
  guestEmail: string | null;
  guestCompany: string | null;
  guestPhoneNumber: string | null;
}

interface EvaluationAnalyticsProps {
  evaluations: EvaluationWithProfile[];
}

export function EvaluationAnalytics({ evaluations }: EvaluationAnalyticsProps) {
  // Prepare data for charts
  const sortedEvaluations = [...evaluations].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Normalize score for display (initial evaluations are out of 45, advanced are out of 100)
  const normalizeScore = (evaluation: EvaluationWithProfile): number => {
    if (evaluation.score === null) return 0;

    // For initial evaluations, convert from out of 45 to percentage
    if (evaluation.type === "INITIAL") {
      return Math.round((evaluation.score / 45) * 100);
    }

    // Advanced evaluations are already out of 100
    return Math.round(evaluation.score);
  };

  // Data for timeline chart with normalized scores
  const timelineData = sortedEvaluations.map((evaluation) => {
    return {
      date: new Date(evaluation.createdAt).toLocaleDateString(),
      score: normalizeScore(evaluation),
      type: evaluation.type,
    };
  });

  // Data for score distribution chart using normalized scores
  const scoreRanges = [
    { name: "0-20%", count: 0 },
    { name: "21-40%", count: 0 },
    { name: "41-60%", count: 0 },
    { name: "61-80%", count: 0 },
    { name: "81-100%", count: 0 },
  ];

  evaluations.forEach((evaluation) => {
    if (evaluation.score === null) return;

    const normalizedScore = normalizeScore(evaluation);
    if (normalizedScore <= 20) scoreRanges[0].count++;
    else if (normalizedScore <= 40) scoreRanges[1].count++;
    else if (normalizedScore <= 60) scoreRanges[2].count++;
    else if (normalizedScore <= 80) scoreRanges[3].count++;
    else scoreRanges[4].count++;
  });

  // Data for type distribution
  const typeDistribution = [
    {
      name: "Inicial",
      count: evaluations.filter((e) => e.type === "INITIAL").length,
    },
    {
      name: "Avanzada",
      count: evaluations.filter((e) => e.type === "ADVANCED").length,
    },
  ];

  // Calculate normalized averages
  const averageScore =
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce((acc, curr) => acc + normalizeScore(curr), 0) /
            evaluations.filter((e) => e.score !== null).length
        )
      : 0;

  const initialAverage =
    evaluations.filter((e) => e.type === "INITIAL").length > 0
      ? Math.round(
          evaluations
            .filter((e) => e.type === "INITIAL")
            .reduce((acc, curr) => acc + normalizeScore(curr), 0) /
            evaluations.filter((e) => e.type === "INITIAL" && e.score !== null)
              .length
        )
      : 0;

  const advancedAverage =
    evaluations.filter((e) => e.type === "ADVANCED").length > 0
      ? Math.round(
          evaluations
            .filter((e) => e.type === "ADVANCED")
            .reduce((acc, curr) => acc + normalizeScore(curr), 0) /
            evaluations.filter((e) => e.type === "ADVANCED" && e.score !== null)
              .length
        )
      : 0;

  // Count guest evaluations
  const guestCount = evaluations.filter(
    (e) => !e.profileId && e.guestEmail
  ).length;

  // Calculate guest average score with normalized values
  const guestAverage =
    guestCount > 0
      ? Math.round(
          evaluations
            .filter((e) => !e.profileId && e.guestEmail)
            .reduce((acc, curr) => acc + normalizeScore(curr), 0) /
            evaluations.filter(
              (e) => !e.profileId && e.guestEmail && e.score !== null
            ).length
        )
      : 0;

  // Create data for guest companies chart
  const guestCompanies = evaluations
    .filter((e) => !e.profileId && e.guestEmail)
    .reduce(
      (acc, curr) => {
        const company =
          curr.guestCompany ||
          (curr.metadata && typeof curr.metadata === "object"
            ? (curr.metadata as GuestMetadata)?.guestInfo?.company
            : null) ||
          "No especificada";

        if (!acc[company]) {
          acc[company] = 1;
        } else {
          acc[company]++;
        }
        return acc;
      },
      {} as Record<string, number>
    );

  const guestCompanyData = Object.entries(guestCompanies)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 companies

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-[600px] grid-cols-3">
        <TabsTrigger value="overview">Resumen</TabsTrigger>
        <TabsTrigger value="charts">Gráficos</TabsTrigger>
        <TabsTrigger value="guests">Invitados</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
              <Info className="h-4 w-4 text-blue-700" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                Normalización de puntuaciones
              </h3>
              <p className="text-xs text-blue-700 mt-1">
                Para facilitar la comparación, todas las puntuaciones se
                muestran en una escala de 0-100%. Las evaluaciones iniciales
                (máximo 45 puntos) y las avanzadas (máximo 100 puntos) han sido
                normalizadas a porcentajes.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Promedio General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                {evaluations.length} evaluaciones
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Promedio Inicial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{initialAverage}%</div>
              <p className="text-xs text-muted-foreground">
                {evaluations.filter((e) => e.type === "INITIAL").length}{" "}
                evaluaciones
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Promedio Avanzada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{advancedAverage}%</div>
              <p className="text-xs text-muted-foreground">
                {evaluations.filter((e) => e.type === "ADVANCED").length}{" "}
                evaluaciones
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="charts" className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
              <Info className="h-4 w-4 text-blue-700" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                Visualización de datos
              </h3>
              <p className="text-xs text-blue-700 mt-1">
                Todos los gráficos muestran puntuaciones normalizadas a una
                escala de 0-100% para facilitar la comparación entre
                evaluaciones iniciales (máximo 45 puntos) y avanzadas (máximo
                100 puntos).
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Distribución de Puntuaciones</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreRanges}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#8884d8"
                    name="Número de evaluaciones"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Tipos de Evaluación</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#82ca9d"
                    name="Número de evaluaciones"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Evolución de Puntuaciones</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Puntuación"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="guests" className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
              <Info className="h-4 w-4 text-blue-700" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                Estadísticas de invitados
              </h3>
              <p className="text-xs text-blue-700 mt-1">
                Las puntuaciones de invitados también se muestran normalizadas a
                una escala de 0-100%, independientemente del tipo de evaluación
                (inicial: 45 puntos, avanzada: 100 puntos). Los invitados son
                usuarios que han completado evaluaciones sin registrarse en la
                plataforma.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invitados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{guestCount}</div>
              <p className="text-xs text-muted-foreground">
                {((guestCount / evaluations.length) * 100).toFixed(1)}% del
                total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Puntuación Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{guestAverage}%</div>
              <p className="text-xs text-muted-foreground">
                Evaluaciones de invitados
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversión</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {guestCount
                  ? Math.round(
                      (evaluations.filter((e) => e.guestEmail && e.profileId)
                        .length /
                        guestCount) *
                        100
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Tasa de registro posterior
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Top Empresas de Invitados</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={guestCompanyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#82ca9d"
                    name="Número de evaluaciones"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
