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

interface EvaluationWithProfile extends Evaluation {
  profile?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    company: string | null;
  } | null;
}

interface EvaluationAnalyticsProps {
  evaluations: EvaluationWithProfile[];
}

export function EvaluationAnalytics({ evaluations }: EvaluationAnalyticsProps) {
  // Prepare data for charts
  const sortedEvaluations = [...evaluations].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Data for timeline chart
  const timelineData = sortedEvaluations.map((evaluation) => {
    return {
      date: new Date(evaluation.createdAt).toLocaleDateString(),
      score: evaluation.score || 0,
      type: evaluation.type,
    };
  });

  // Data for score distribution chart
  const scoreRanges = [
    { name: "0-20%", count: 0 },
    { name: "21-40%", count: 0 },
    { name: "41-60%", count: 0 },
    { name: "61-80%", count: 0 },
    { name: "81-100%", count: 0 },
  ];

  evaluations.forEach((evaluation) => {
    if (evaluation.score === null) return;

    const score = evaluation.score;
    if (score <= 20) scoreRanges[0].count++;
    else if (score <= 40) scoreRanges[1].count++;
    else if (score <= 60) scoreRanges[2].count++;
    else if (score <= 80) scoreRanges[3].count++;
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

  // Calculate averages
  const averageScore =
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce((acc, curr) => acc + (curr.score || 0), 0) /
            evaluations.filter((e) => e.score !== null).length
        )
      : 0;

  const initialAverage =
    evaluations.filter((e) => e.type === "INITIAL").length > 0
      ? Math.round(
          evaluations
            .filter((e) => e.type === "INITIAL")
            .reduce((acc, curr) => acc + (curr.score || 0), 0) /
            evaluations.filter((e) => e.type === "INITIAL" && e.score !== null)
              .length
        )
      : 0;

  const advancedAverage =
    evaluations.filter((e) => e.type === "ADVANCED").length > 0
      ? Math.round(
          evaluations
            .filter((e) => e.type === "ADVANCED")
            .reduce((acc, curr) => acc + (curr.score || 0), 0) /
            evaluations.filter((e) => e.type === "ADVANCED" && e.score !== null)
              .length
        )
      : 0;

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-[400px] grid-cols-2">
        <TabsTrigger value="overview">Resumen</TabsTrigger>
        <TabsTrigger value="charts">Gráficos</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
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
    </Tabs>
  );
}
