"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, InfoIcon } from "lucide-react";
import type {
  QuizData,
  QuizResults,
  UserInfo,
} from "@/components/evaluations/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface EvaluationData {
  id: string;
  title: string;
  date: Date;
  answers: QuizResults;
  userInfo: UserInfo;
  score: number;
}

interface EvaluationComparisonProps {
  quizData: QuizData;
  firstEvaluation: EvaluationData;
  secondEvaluation: EvaluationData;
  evaluationType: "INITIAL" | "ADVANCED";
}

interface CategoryScore {
  category: string;
  firstScore: number;
  secondScore: number;
  firstMax: number;
  secondMax: number;
  difference: number;
  percentageDifference: number;
}

interface QuestionComparison {
  id: string;
  text: string;
  category: string;
  firstScore: number;
  secondScore: number;
  maxScore: number;
  difference: number;
  percentageDifference: number;
}

// Add insights based on evaluation type
const getTypeSpecificInsights = (
  evaluationType: "INITIAL" | "ADVANCED",
  categoryScores: Record<string, CategoryScore>
) => {
  if (evaluationType === "INITIAL") {
    return {
      title: "Insights de Evaluación Inicial",
      description:
        "Las evaluaciones iniciales miden los fundamentos básicos de seguridad en tu organización.",
      insights: [
        {
          category: "Mejora Prioritaria",
          text: Object.values(categoryScores)
            .sort(
              (a, b) =>
                a.secondScore / a.secondMax - b.secondScore / b.secondMax
            )
            .slice(0, 1)
            .map(
              (c) =>
                `Se recomienda priorizar mejoras en ${c.category} para fortalecer la seguridad básica.`
            )[0],
        },
        {
          category: "Próximos Pasos",
          text: "Considera realizar una evaluación avanzada para obtener un análisis más detallado de tu postura de seguridad.",
        },
      ],
    };
  } else {
    return {
      title: "Insights de Evaluación Avanzada",
      description:
        "Las evaluaciones avanzadas proporcionan un análisis detallado de tu madurez en ciberseguridad.",
      insights: [
        {
          category: "Área de Enfoque",
          text: Object.values(categoryScores)
            .sort(
              (a, b) =>
                a.secondScore / a.secondMax - b.secondScore / b.secondMax
            )
            .slice(0, 1)
            .map(
              (c) =>
                `El área de ${c.category} requiere atención especializada para alcanzar un nivel óptimo de seguridad.`
            )[0],
        },
        {
          category: "Recomendación",
          text: "Considera implementar auditorías periódicas o contratar especialistas en las áreas con puntuaciones más bajas.",
        },
      ],
    };
  }
};

export function EvaluationComparison({
  quizData,
  firstEvaluation,
  secondEvaluation,
  evaluationType,
}: EvaluationComparisonProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate overall score difference
  const scoreDifference = secondEvaluation.score - firstEvaluation.score;
  const percentageDifference =
    firstEvaluation.score > 0
      ? (scoreDifference / Math.max(0.1, firstEvaluation.score)) * 100
      : 0;

  // Format dates
  const firstDate = format(new Date(firstEvaluation.date), "d MMM yyyy", {
    locale: es,
  });
  const secondDate = format(new Date(secondEvaluation.date), "d MMM yyyy", {
    locale: es,
  });

  // Calculate category scores
  const categoryScores: Record<string, CategoryScore> = {};

  // Process all questions to calculate category scores
  for (const question of quizData.questions) {
    const category = question.category || "General";
    const firstScore = firstEvaluation.answers[question.id] || 0;
    const secondScore = secondEvaluation.answers[question.id] || 0;
    const maxScore = Math.max(...question.options.map((o) => o.value));

    if (!categoryScores[category]) {
      categoryScores[category] = {
        category,
        firstScore: 0,
        secondScore: 0,
        firstMax: 0,
        secondMax: 0,
        difference: 0,
        percentageDifference: 0,
      };
    }

    categoryScores[category].firstScore += firstScore;
    categoryScores[category].secondScore += secondScore;
    categoryScores[category].firstMax += maxScore;
    categoryScores[category].secondMax += maxScore;
  }

  // Calculate differences for each category
  for (const category of Object.values(categoryScores)) {
    category.difference = category.secondScore - category.firstScore;
    category.percentageDifference =
      category.firstScore > 0
        ? (category.difference / Math.max(0.1, category.firstScore)) * 100
        : 0;
  }

  // Create question comparisons
  const questionComparisons: QuestionComparison[] = quizData.questions.map(
    (question) => {
      const firstScore = firstEvaluation.answers[question.id] || 0;
      const secondScore = secondEvaluation.answers[question.id] || 0;
      const maxScore = Math.max(...question.options.map((o) => o.value));
      const difference = secondScore - firstScore;
      const percentageDifference =
        firstScore > 0 ? (difference / Math.max(0.1, firstScore)) * 100 : 0;

      return {
        id: question.id,
        text: question.text,
        category: question.category || "General",
        firstScore,
        secondScore,
        maxScore,
        difference,
        percentageDifference,
      };
    }
  );

  // Get type-specific insights
  const typeInsights = getTypeSpecificInsights(evaluationType, categoryScores);

  // Function to get color based on difference
  const getDifferenceColor = (difference: number) => {
    if (difference > 0) return "text-green-600";
    if (difference < 0) return "text-red-600";
    return "text-gray-600";
  };

  // Function to get badge color based on score
  const getScoreBadgeColor = (score: number) => {
    if (score < 40) return "bg-red-100 text-red-800";
    if (score < 60) return "bg-orange-100 text-orange-800";
    if (score < 80) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  // Function to get icon based on difference
  const getDifferenceIcon = (difference: number) => {
    if (difference > 0)
      return <ArrowUpIcon className="h-4 w-4 text-green-600" />;
    if (difference < 0)
      return <ArrowDownIcon className="h-4 w-4 text-red-600" />;
    return <MinusIcon className="h-4 w-4 text-gray-600" />;
  };

  // Function to get maturity level label
  const getMaturityLevel = (score: number) => {
    if (score < 20) return "Inicial (Nivel 1)";
    if (score < 40) return "Repetible (Nivel 2)";
    if (score < 60) return "Definido (Nivel 3)";
    if (score < 80) return "Gestionado (Nivel 4)";
    return "Optimizado (Nivel 5)";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span>Análisis Comparativo Detallado</span>
            <Badge variant="outline" className="text-xs">
              {evaluationType === "INITIAL"
                ? "Evaluación Inicial"
                : "Evaluación Avanzada"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Comparación exhaustiva entre Evaluación 1 ({firstDate}) y Evaluación
            2 ({secondDate})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Evaluación 1 Score Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
                  Evaluación 1
                </span>
              </div>
              <div className="space-y-3">
                <div className="text-center">
                  <Badge
                    className={cn(
                      "text-lg px-4 py-2",
                      getScoreBadgeColor(firstEvaluation.score)
                    )}
                    variant="secondary"
                  >
                    {Math.round(firstEvaluation.score)}%
                  </Badge>
                  <p className="text-sm mt-2 text-blue-700 font-medium">
                    {getMaturityLevel(firstEvaluation.score)}
                  </p>
                </div>
                <div className="bg-white/70 p-3 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Usuario:</p>
                  <p className="text-sm font-medium">
                    {firstEvaluation.userInfo.firstName}{" "}
                    {firstEvaluation.userInfo.lastName}
                  </p>
                </div>
                <div className="bg-white/70 p-3 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Fecha:</p>
                  <p className="text-sm font-medium">{firstDate}</p>
                </div>
              </div>
            </div>

            {/* Comparison Summary */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border-2 border-gray-200">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Diferencia
                </h3>
                <div className="flex items-center justify-center">
                  {getDifferenceIcon(scoreDifference)}
                  <span
                    className={cn(
                      "ml-2 text-2xl font-bold",
                      getDifferenceColor(scoreDifference)
                    )}
                  >
                    {scoreDifference > 0 ? "+" : ""}
                    {Math.round(scoreDifference)}%
                  </span>
                </div>
                <div className="bg-white p-4 rounded-md">
                  <p className="text-sm text-gray-600">Cambio relativo:</p>
                  <p
                    className={cn(
                      "font-semibold",
                      getDifferenceColor(scoreDifference)
                    )}
                  >
                    {Math.round(percentageDifference)}%{" "}
                    {scoreDifference > 0 ? "de mejora" : "de disminución"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    De {Math.round(firstEvaluation.score)}% a{" "}
                    {Math.round(secondEvaluation.score)}%
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  {scoreDifference > 0
                    ? "📈 Mejora detectada"
                    : scoreDifference < 0
                      ? "📉 Disminución detectada"
                      : "➡️ Sin cambios significativos"}
                </div>
              </div>
            </div>

            {/* Evaluación 2 Score Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
                  Evaluación 2
                </span>
              </div>
              <div className="space-y-3">
                <div className="text-center">
                  <Badge
                    className={cn(
                      "text-lg px-4 py-2",
                      getScoreBadgeColor(secondEvaluation.score)
                    )}
                    variant="secondary"
                  >
                    {Math.round(secondEvaluation.score)}%
                  </Badge>
                  <p className="text-sm mt-2 text-green-700 font-medium">
                    {getMaturityLevel(secondEvaluation.score)}
                  </p>
                </div>
                <div className="bg-white/70 p-3 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Usuario:</p>
                  <p className="text-sm font-medium">
                    {secondEvaluation.userInfo.firstName}{" "}
                    {secondEvaluation.userInfo.lastName}
                  </p>
                </div>
                <div className="bg-white/70 p-3 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Fecha:</p>
                  <p className="text-sm font-medium">{secondDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Type-specific insights */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200 mb-6">
            <h3 className="text-lg font-medium mb-2 flex items-center text-indigo-700">
              {typeInsights.title}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 ml-2 text-indigo-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>{typeInsights.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {typeInsights.insights.map((insight, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-md border border-indigo-100"
                >
                  <p className="font-medium text-sm text-indigo-800">
                    {insight.category}
                  </p>
                  <p className="text-sm mt-1 text-gray-700">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="categories">Categorías</TabsTrigger>
              <TabsTrigger value="questions">Preguntas</TabsTrigger>
              <TabsTrigger value="detailed">Análisis Detallado</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen Ejecutivo de Cambios</CardTitle>
                  <CardDescription>
                    Análisis de alto nivel de los cambios entre Evaluación 1 y
                    Evaluación 2
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Interpretation Section */}
                    <div className="p-5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                      <h4 className="font-semibold mb-3 text-blue-800 flex items-center">
                        📊 Interpretación General
                      </h4>
                      {scoreDifference > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm text-green-700 font-medium">
                            ✅ La puntuación ha mejorado un{" "}
                            {Math.abs(Math.round(percentageDifference))}% desde
                            la Evaluación 1 (de{" "}
                            {Math.round(firstEvaluation.score)}% a{" "}
                            {Math.round(secondEvaluation.score)}%).
                          </p>
                          <p className="text-sm text-gray-600">
                            Esto indica un progreso positivo en la madurez de
                            ciberseguridad de tu organización. Las medidas
                            implementadas están dando resultados efectivos.
                          </p>
                        </div>
                      ) : scoreDifference < 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm text-red-700 font-medium">
                            ⚠️ La puntuación ha disminuido un{" "}
                            {Math.abs(Math.round(percentageDifference))}% desde
                            la Evaluación 1 (de{" "}
                            {Math.round(firstEvaluation.score)}% a{" "}
                            {Math.round(secondEvaluation.score)}%).
                          </p>
                          <p className="text-sm text-gray-600">
                            Esta disminución podría indicar nuevas
                            vulnerabilidades, cambios en el entorno o la
                            necesidad de reforzar las medidas de seguridad
                            existentes.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-700 font-medium">
                            ➡️ No hay cambios significativos en la puntuación
                            general.
                          </p>
                          <p className="text-sm text-gray-600">
                            Esto puede indicar estabilidad en las medidas de
                            seguridad, pero se recomienda revisar áreas
                            específicas para identificar oportunidades de
                            mejora.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Top Improvements */}
                    <div>
                      <h4 className="font-semibold mb-3 text-green-800 flex items-center">
                        📈 Áreas de Mayor Mejora
                      </h4>
                      <div className="space-y-2">
                        {Object.values(categoryScores)
                          .filter((category) => category.difference > 0)
                          .sort((a, b) => b.difference - a.difference)
                          .slice(0, 3)
                          .map((category) => (
                            <div
                              key={category.category}
                              className="p-4 rounded-lg bg-green-50 border border-green-200"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-green-800">
                                  🎯 {category.category}
                                </span>
                                <div className="text-right">
                                  <span className="text-green-800 font-semibold">
                                    +{Math.round(category.difference)} puntos
                                  </span>
                                  <span className="text-green-600 text-sm ml-2">
                                    ({Math.round(category.percentageDifference)}
                                    %)
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  Evaluación 1:{" "}
                                  {Math.round(
                                    (category.firstScore / category.firstMax) *
                                      100
                                  )}
                                  %
                                </span>
                                <span className="text-gray-600">
                                  Evaluación 2:{" "}
                                  {Math.round(
                                    (category.secondScore /
                                      category.secondMax) *
                                      100
                                  )}
                                  %
                                </span>
                              </div>
                            </div>
                          ))}
                        {Object.values(categoryScores).filter(
                          (category) => category.difference > 0
                        ).length === 0 && (
                          <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg">
                            No se encontraron áreas con mejoras significativas
                            entre las evaluaciones.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Areas Needing Attention */}
                    <div>
                      <h4 className="font-semibold mb-3 text-red-800 flex items-center">
                        📉 Áreas que Requieren Atención
                      </h4>
                      <div className="space-y-2">
                        {Object.values(categoryScores)
                          .filter((category) => category.difference < 0)
                          .sort((a, b) => a.difference - b.difference)
                          .slice(0, 3)
                          .map((category) => (
                            <div
                              key={category.category}
                              className="p-4 rounded-lg bg-red-50 border border-red-200"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-red-800">
                                  🚨 {category.category}
                                </span>
                                <div className="text-right">
                                  <span className="text-red-800 font-semibold">
                                    {Math.round(category.difference)} puntos
                                  </span>
                                  <span className="text-red-600 text-sm ml-2">
                                    ({Math.round(category.percentageDifference)}
                                    %)
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  Evaluación 1:{" "}
                                  {Math.round(
                                    (category.firstScore / category.firstMax) *
                                      100
                                  )}
                                  %
                                </span>
                                <span className="text-gray-600">
                                  Evaluación 2:{" "}
                                  {Math.round(
                                    (category.secondScore /
                                      category.secondMax) *
                                      100
                                  )}
                                  %
                                </span>
                              </div>
                            </div>
                          ))}
                        {Object.values(categoryScores).filter(
                          (category) => category.difference < 0
                        ).length === 0 && (
                          <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg">
                            No se encontraron áreas con disminuciones
                            significativas entre las evaluaciones.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comparación Detallada por Categorías</CardTitle>
                  <CardDescription>
                    Análisis categorizado entre Evaluación 1 y Evaluación 2
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.values(categoryScores).map((category) => (
                      <motion.div
                        key={category.category}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-lg border bg-gradient-to-r from-gray-50 to-gray-100"
                      >
                        <h4 className="font-semibold mb-4 text-lg">
                          {category.category}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                          {/* Evaluación 1 */}
                          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                Evaluación 1
                              </span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <Progress
                                value={
                                  (category.firstScore / category.firstMax) *
                                  100
                                }
                                className="flex-1 h-3 bg-white"
                              />
                              <span className="ml-3 text-sm font-bold text-blue-700">
                                {Math.round(
                                  (category.firstScore / category.firstMax) *
                                    100
                                )}
                                %
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              Puntos: {category.firstScore}/{category.firstMax}
                            </p>
                          </div>

                          {/* Evaluación 2 */}
                          <div className="bg-green-50 p-4 rounded-md border border-green-200">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                Evaluación 2
                              </span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <Progress
                                value={
                                  (category.secondScore / category.secondMax) *
                                  100
                                }
                                className="flex-1 h-3 bg-white"
                              />
                              <span className="ml-3 text-sm font-bold text-green-700">
                                {Math.round(
                                  (category.secondScore / category.secondMax) *
                                    100
                                )}
                                %
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              Puntos: {category.secondScore}/
                              {category.secondMax}
                            </p>
                          </div>
                        </div>

                        {/* Difference Analysis */}
                        <div className="bg-white p-4 rounded-md border">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {getDifferenceIcon(category.difference)}
                              <span className="ml-2 font-medium">
                                Diferencia:
                              </span>
                            </div>
                            <div className="text-right">
                              <span
                                className={cn(
                                  "font-bold text-lg",
                                  getDifferenceColor(category.difference)
                                )}
                              >
                                {category.difference > 0 ? "+" : ""}
                                {Math.round(category.difference)} puntos
                              </span>
                              <span
                                className={cn(
                                  "ml-2 text-sm",
                                  getDifferenceColor(category.difference)
                                )}
                              >
                                (
                                {Math.abs(
                                  Math.round(category.percentageDifference)
                                )}
                                %)
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comparación por Pregunta Individual</CardTitle>
                  <CardDescription>
                    Análisis detallado pregunta por pregunta entre Evaluación 1
                    y Evaluación 2
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {questionComparisons.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-5 rounded-lg border bg-gradient-to-r from-gray-50 to-gray-100"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium text-gray-800 flex-1 pr-4">
                            {question.text}
                          </h4>
                          <Badge
                            variant="outline"
                            className="shrink-0 bg-white"
                          >
                            {question.category}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Evaluación 1 */}
                          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                Evaluación 1
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <Progress
                                value={
                                  (question.firstScore / question.maxScore) *
                                  100
                                }
                                className="flex-1 h-3 bg-white"
                              />
                              <span className="ml-3 text-sm font-bold text-blue-700">
                                {question.firstScore}/{question.maxScore}
                              </span>
                            </div>
                          </div>

                          {/* Evaluación 2 */}
                          <div className="bg-green-50 p-4 rounded-md border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                Evaluación 2
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <Progress
                                value={
                                  (question.secondScore / question.maxScore) *
                                  100
                                }
                                className="flex-1 h-3 bg-white"
                              />
                              <span className="ml-3 text-sm font-bold text-green-700">
                                {question.secondScore}/{question.maxScore}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Question Difference */}
                        <div className="bg-white p-3 rounded-md border flex items-center justify-between">
                          <div className="flex items-center">
                            {getDifferenceIcon(question.difference)}
                            <span className="ml-2 text-sm font-medium">
                              Cambio:
                            </span>
                          </div>
                          <span
                            className={cn(
                              "text-sm font-semibold",
                              getDifferenceColor(question.difference)
                            )}
                          >
                            {question.difference > 0 ? "+" : ""}
                            {question.difference} puntos
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="detailed" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análisis Estadístico Detallado</CardTitle>
                  <CardDescription>
                    Métricas avanzadas y recomendaciones específicas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Statistical Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-blue-800 mb-2">
                          📊 Estadísticas Evaluación 1
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Puntuación:</span>
                            <span className="font-medium">
                              {Math.round(firstEvaluation.score)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Preguntas:</span>
                            <span className="font-medium">
                              {questionComparisons.length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Categorías:</span>
                            <span className="font-medium">
                              {Object.keys(categoryScores).length}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h5 className="font-semibold text-gray-800 mb-2">
                          📈 Cambios Detectados
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Mejoras:</span>
                            <span className="font-medium text-green-600">
                              {
                                Object.values(categoryScores).filter(
                                  (c) => c.difference > 0
                                ).length
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Disminuciones:</span>
                            <span className="font-medium text-red-600">
                              {
                                Object.values(categoryScores).filter(
                                  (c) => c.difference < 0
                                ).length
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sin cambios:</span>
                            <span className="font-medium text-gray-600">
                              {
                                Object.values(categoryScores).filter(
                                  (c) => c.difference === 0
                                ).length
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h5 className="font-semibold text-green-800 mb-2">
                          📊 Estadísticas Evaluación 2
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Puntuación:</span>
                            <span className="font-medium">
                              {Math.round(secondEvaluation.score)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Diferencia absoluta:</span>
                            <span
                              className={cn(
                                "font-medium",
                                getDifferenceColor(scoreDifference)
                              )}
                            >
                              {scoreDifference > 0 ? "+" : ""}
                              {Math.round(scoreDifference)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Diferencia relativa:</span>
                            <span
                              className={cn(
                                "font-medium",
                                getDifferenceColor(scoreDifference)
                              )}
                            >
                              {Math.round(percentageDifference)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
                      <h5 className="font-semibold text-purple-800 mb-4 flex items-center">
                        💡 Recomendaciones Estratégicas
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-md border border-purple-100">
                          <h6 className="font-medium text-purple-700 mb-2">
                            Acciones Inmediatas
                          </h6>
                          <ul className="text-sm space-y-1 text-gray-700">
                            {Object.values(categoryScores)
                              .filter((c) => c.difference < 0)
                              .slice(0, 2)
                              .map((category, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>
                                    Revisar procesos en {category.category}
                                  </span>
                                </li>
                              ))}
                            {Object.values(categoryScores).filter(
                              (c) => c.difference < 0
                            ).length === 0 && (
                              <li className="text-green-600">
                                ✅ No se requieren acciones correctivas
                                inmediatas
                              </li>
                            )}
                          </ul>
                        </div>
                        <div className="bg-white p-4 rounded-md border border-purple-100">
                          <h6 className="font-medium text-purple-700 mb-2">
                            Oportunidades de Mejora
                          </h6>
                          <ul className="text-sm space-y-1 text-gray-700">
                            {Object.values(categoryScores)
                              .filter((c) => c.difference >= 0)
                              .sort(
                                (a, b) =>
                                  a.secondScore / a.secondMax -
                                  b.secondScore / b.secondMax
                              )
                              .slice(0, 2)
                              .map((category, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>Optimizar {category.category}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
