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
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";
import type {
  QuizData,
  QuizResults,
  UserInfo,
} from "@/components/evaluations/types";

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

export function EvaluationComparison({
  quizData,
  firstEvaluation,
  secondEvaluation,
}: EvaluationComparisonProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate overall score difference
  const scoreDifference = secondEvaluation.score - firstEvaluation.score;
  const percentageDifference =
    firstEvaluation.score > 0
      ? (scoreDifference / firstEvaluation.score) * 100
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
        ? (category.difference / category.firstScore) * 100
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
        firstScore > 0 ? (difference / firstScore) * 100 : 0;

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comparación de Evaluaciones</CardTitle>
          <CardDescription>
            Comparando resultados entre {firstEvaluation.title} ({firstDate}) y{" "}
            {secondEvaluation.title} ({secondDate})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">Puntuación General</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {firstEvaluation.title} ({firstDate})
                  </p>
                  <Badge
                    className={getScoreBadgeColor(firstEvaluation.score)}
                    variant="secondary"
                  >
                    {Math.round(firstEvaluation.score)}%
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {secondEvaluation.title} ({secondDate})
                  </p>
                  <Badge
                    className={getScoreBadgeColor(secondEvaluation.score)}
                    variant="secondary"
                  >
                    {Math.round(secondEvaluation.score)}%
                  </Badge>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium mb-1">Diferencia</p>
                <div className="flex items-center">
                  {getDifferenceIcon(scoreDifference)}
                  <span
                    className={cn(
                      "ml-1 font-medium",
                      getDifferenceColor(scoreDifference)
                    )}
                  >
                    {scoreDifference > 0 ? "+" : ""}
                    {Math.round(scoreDifference)}% (
                    {Math.abs(Math.round(percentageDifference))}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">Progreso</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">
                      {firstEvaluation.title} ({firstDate})
                    </span>
                    <span className="text-sm font-medium">
                      {Math.round(firstEvaluation.score)}%
                    </span>
                  </div>
                  <Progress
                    value={firstEvaluation.score}
                    className="h-2 bg-gray-100"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">
                      {secondEvaluation.title} ({secondDate})
                    </span>
                    <span className="text-sm font-medium">
                      {Math.round(secondEvaluation.score)}%
                    </span>
                  </div>
                  <Progress
                    value={secondEvaluation.score}
                    className="h-2 bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="categories">Categorías</TabsTrigger>
              <TabsTrigger value="questions">Preguntas</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de Cambios</CardTitle>
                  <CardDescription>
                    Visión general de los cambios entre las dos evaluaciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gray-50 border">
                      <h4 className="font-medium mb-2">Interpretación</h4>
                      {scoreDifference > 0 ? (
                        <p className="text-sm text-green-700">
                          La puntuación ha mejorado un{" "}
                          {Math.abs(Math.round(percentageDifference))}% desde la
                          evaluación anterior, lo que indica un progreso
                          positivo en la madurez de ciberseguridad.
                        </p>
                      ) : scoreDifference < 0 ? (
                        <p className="text-sm text-red-700">
                          La puntuación ha disminuido un{" "}
                          {Math.abs(Math.round(percentageDifference))}% desde la
                          evaluación anterior, lo que podría indicar áreas que
                          requieren atención.
                        </p>
                      ) : (
                        <p className="text-sm text-gray-700">
                          No hay cambios significativos en la puntuación general
                          entre las dos evaluaciones.
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        Áreas de Mayor Mejora
                      </h4>
                      {Object.values(categoryScores)
                        .filter((category) => category.difference > 0)
                        .sort((a, b) => b.difference - a.difference)
                        .slice(0, 3)
                        .map((category) => (
                          <div
                            key={category.category}
                            className="p-3 mb-2 rounded-lg bg-green-50 border border-green-100"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium text-green-800">
                                {category.category}
                              </span>
                              <span className="text-green-800">
                                +{Math.round(category.difference)} puntos (
                                {Math.round(category.percentageDifference)}%)
                              </span>
                            </div>
                          </div>
                        ))}
                      {Object.values(categoryScores).filter(
                        (category) => category.difference > 0
                      ).length === 0 && (
                        <p className="text-sm text-gray-500 italic">
                          No se encontraron áreas con mejoras significativas
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        Áreas que Requieren Atención
                      </h4>
                      {Object.values(categoryScores)
                        .filter((category) => category.difference < 0)
                        .sort((a, b) => a.difference - b.difference)
                        .slice(0, 3)
                        .map((category) => (
                          <div
                            key={category.category}
                            className="p-3 mb-2 rounded-lg bg-red-50 border border-red-100"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium text-red-800">
                                {category.category}
                              </span>
                              <span className="text-red-800">
                                {Math.round(category.difference)} puntos (
                                {Math.round(category.percentageDifference)}%)
                              </span>
                            </div>
                          </div>
                        ))}
                      {Object.values(categoryScores).filter(
                        (category) => category.difference < 0
                      ).length === 0 && (
                        <p className="text-sm text-gray-500 italic">
                          No se encontraron áreas con disminuciones
                          significativas
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comparación por Categorías</CardTitle>
                  <CardDescription>
                    Análisis detallado por categoría entre las dos evaluaciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.values(categoryScores).map((category) => (
                      <motion.div
                        key={category.category}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg border"
                      >
                        <h4 className="font-medium mb-3">
                          {category.category}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {firstEvaluation.title} ({firstDate})
                            </p>
                            <div className="flex items-center">
                              <Progress
                                value={
                                  (category.firstScore / category.firstMax) *
                                  100
                                }
                                className="flex-1 h-2 bg-gray-100"
                              />
                              <span className="ml-2 text-sm font-medium">
                                {Math.round(
                                  (category.firstScore / category.firstMax) *
                                    100
                                )}
                                %
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {secondEvaluation.title} ({secondDate})
                            </p>
                            <div className="flex items-center">
                              <Progress
                                value={
                                  (category.secondScore / category.secondMax) *
                                  100
                                }
                                className="flex-1 h-2 bg-gray-100"
                              />
                              <span className="ml-2 text-sm font-medium">
                                {Math.round(
                                  (category.secondScore / category.secondMax) *
                                    100
                                )}
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center mt-2">
                          {getDifferenceIcon(category.difference)}
                          <span
                            className={cn(
                              "ml-1 text-sm",
                              getDifferenceColor(category.difference)
                            )}
                          >
                            Diferencia: {category.difference > 0 ? "+" : ""}
                            {Math.round(category.difference)} puntos (
                            {Math.abs(
                              Math.round(category.percentageDifference)
                            )}
                            %)
                          </span>
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
                  <CardTitle>Comparación por Preguntas</CardTitle>
                  <CardDescription>
                    Análisis detallado por pregunta entre las dos evaluaciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {questionComparisons.map((question) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg border"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium">{question.text}</h4>
                          <Badge variant="outline">{question.category}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {firstEvaluation.title} ({firstDate})
                            </p>
                            <div className="flex items-center">
                              <Progress
                                value={
                                  (question.firstScore / question.maxScore) *
                                  100
                                }
                                className="flex-1 h-2 bg-gray-100"
                              />
                              <span className="ml-2 text-sm font-medium">
                                {question.firstScore}/{question.maxScore}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {secondEvaluation.title} ({secondDate})
                            </p>
                            <div className="flex items-center">
                              <Progress
                                value={
                                  (question.secondScore / question.maxScore) *
                                  100
                                }
                                className="flex-1 h-2 bg-gray-100"
                              />
                              <span className="ml-2 text-sm font-medium">
                                {question.secondScore}/{question.maxScore}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center mt-2">
                          {getDifferenceIcon(question.difference)}
                          <span
                            className={cn(
                              "ml-1 text-sm",
                              getDifferenceColor(question.difference)
                            )}
                          >
                            Diferencia: {question.difference > 0 ? "+" : ""}
                            {question.difference} puntos
                          </span>
                        </div>
                      </motion.div>
                    ))}
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
