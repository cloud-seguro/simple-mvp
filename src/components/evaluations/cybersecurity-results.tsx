"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { QuizData, QuizResults, UserInfo, InterestOption } from "./types";
import { cn } from "@/lib/utils";
import { getMaturityLevel } from "@/lib/maturity-utils";
import { SpecialistsRecommendations } from "./specialists-recommendations";
import Link from "next/link";
import { ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CybersecurityResultsProps {
  quizData: QuizData;
  results: QuizResults;
  userInfo: UserInfo;
  onRestart?: () => void;
  isSharedView?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interest?: InterestOption | null | string;
  score?: number;
  maxScore?: number;
  maturityDescription?: string;
  maturityLevelNumber?: number;
  weakestCategories?: string[];
  recommendations?: Array<{
    score: number;
    maxScore: number;
    text: string;
    selectedOption: string;
    category: string;
    recommendation: string;
  }>;
  categories?: Array<{
    name: string;
    score: number;
    maxScore: number;
  }>;
  hideHeader?: boolean;
}

interface QuestionRecommendation {
  score: number;
  maxScore: number;
  text: string;
  selectedOption: string;
  category: string;
  recommendation: string;
}

export function CybersecurityResults({
  quizData,
  results,
  userInfo,
  onRestart,
  isSharedView = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interest,
  score,
  maxScore,
  maturityDescription,
  maturityLevelNumber,
  weakestCategories,
  recommendations: providedRecommendations,
  categories,
  hideHeader = false,
}: CybersecurityResultsProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [specialistsAvailable, setSpecialistsAvailable] = useState(false);
  const [loadingSpecialists, setLoadingSpecialists] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error) {
          setIsAuthenticated(!!data.session);
        }
      } catch (err) {
        console.error("Error checking auth:", err);
      }
    }

    checkAuth();
  }, [supabase]);

  // Map the keys from the results to the keys in the evaluation data
  const mapResultsToQuizData = (
    results: QuizResults,
    quizData: QuizData
  ): QuizResults => {
    const mappedResults: QuizResults = {};

    // Copy all existing results first
    for (const [key, value] of Object.entries(results)) {
      mappedResults[key] = value;
    }

    // Initial evaluation specific mapping
    if (quizData.id === "evaluacion-inicial") {
      // Check if we're missing the last question (indicadores-3)
      if (
        Object.keys(mappedResults).includes("indicadores-2") &&
        !Object.keys(mappedResults).includes("indicadores-3")
      ) {
        // Use the same value as indicadores-2 instead of defaulting to 0
        const indicadores2Value = mappedResults["indicadores-2"] || 2;
        console.log(
          `Adding missing indicadores-3 key with value ${indicadores2Value} (copied from indicadores-2)`
        );
        mappedResults["indicadores-3"] = indicadores2Value;
      }
    }

    // Advanced evaluation specific mapping
    if (quizData.id === "evaluacion-avanzada") {
      // For advanced evaluation, use the average of existing answers for missing keys
      const existingValues = Object.values(mappedResults).filter(
        (v) => typeof v === "number"
      ) as number[];
      const averageValue =
        existingValues.length > 0
          ? Math.round(
              existingValues.reduce((sum, val) => sum + val, 0) /
                existingValues.length
            )
          : 2; // Default to 2 if no values exist

      // Check for missing keys in the advanced evaluation
      const advancedKeys = [
        "continuidad-1",
        "continuidad-2",
        "continuidad-3",
        "incidentes-3",
      ];

      for (const key of advancedKeys) {
        if (!Object.keys(mappedResults).includes(key)) {
          console.log(
            `Adding missing ${key} key with value ${averageValue} (average of existing answers)`
          );
          mappedResults[key] = averageValue;
        }
      }
    }

    // Ensure all questions in the quiz data have answers
    for (const question of quizData.questions) {
      if (mappedResults[question.id] === undefined) {
        // Use the average of existing values instead of defaulting to 0
        const existingValues = Object.values(mappedResults).filter(
          (v) => typeof v === "number"
        ) as number[];
        const averageValue =
          existingValues.length > 0
            ? Math.round(
                existingValues.reduce((sum, val) => sum + val, 0) /
                  existingValues.length
              )
            : 2; // Default to 2 if no values exist

        console.log(
          `Adding missing ${question.id} key with value ${averageValue} (average of existing answers)`
        );
        mappedResults[question.id] = averageValue;
      }
    }

    return mappedResults;
  };

  // Apply the mapping
  const mappedResults = mapResultsToQuizData(results, quizData);
  console.log(
    "CybersecurityResults - mapped results:",
    JSON.stringify(mappedResults)
  );

  // Check for missing questions
  const missingQuestions = quizData.questions.filter(
    (question) => mappedResults[question.id] === undefined
  );

  if (missingQuestions.length > 0) {
    console.log(
      "CybersecurityResults - Missing questions:",
      missingQuestions.map((q) => q.id)
    );
  }

  // Ensure all questions have answers
  const processedResults = { ...mappedResults };
  for (const question of quizData.questions) {
    if (processedResults[question.id] === undefined) {
      console.log(
        `Question ${question.id} has no answer in CybersecurityResults, setting default value 0`
      );
      processedResults[question.id] = 0;
    }
  }

  // Final check
  console.log(
    "CybersecurityResults - processed results count:",
    Object.keys(processedResults).length
  );
  console.log(
    "CybersecurityResults - all questions included:",
    Object.keys(processedResults).length === quizData.questions.length
  );

  // Calculate scores by category and collect recommendations only if not provided
  let categoryScores: Record<string, { total: number; max: number }> = {};
  let recommendations: QuestionRecommendation[] = providedRecommendations || [];
  let overallScore = score || 0;
  let maxPossibleScore = maxScore || 0;

  // If maxScore wasn't provided, calculate it based on quiz type
  if (!maxScore) {
    if (quizData.id === "evaluacion-avanzada") {
      maxPossibleScore = 100; // Set to 100 for advanced evaluation
    } else {
      // For initial evaluation or others, calculate from quiz data
      maxPossibleScore = quizData.questions.reduce(
        (sum, q) => sum + Math.max(...q.options.map((o) => o.value)),
        0
      );
    }
  }

  // Ensure overall score doesn't exceed maximum
  if (quizData.id === "evaluacion-inicial" && overallScore > maxPossibleScore) {
    overallScore = maxPossibleScore;
  }

  const maturity = maturityDescription
    ? {
        level: maturityLevelNumber ? `Nivel ${maturityLevelNumber}` : "",
        emoji:
          maturityLevelNumber === 1
            ? "🔴"
            : maturityLevelNumber === 2
              ? "🟠"
              : maturityLevelNumber === 3
                ? "🟡"
                : maturityLevelNumber === 4
                  ? "🟢"
                  : "🔵",
        color:
          maturityLevelNumber === 1
            ? "text-red-600"
            : maturityLevelNumber === 2
              ? "text-orange-600"
              : maturityLevelNumber === 3
                ? "text-yellow-600"
                : maturityLevelNumber === 4
                  ? "text-green-600"
                  : "text-blue-600",
        bgColor:
          maturityLevelNumber === 1
            ? "bg-red-100"
            : maturityLevelNumber === 2
              ? "bg-orange-100"
              : maturityLevelNumber === 3
                ? "bg-yellow-100"
                : maturityLevelNumber === 4
                  ? "bg-green-100"
                  : "bg-blue-100",
        description: maturityDescription,
      }
    : getMaturityLevel(quizData.id, overallScore);

  // If categories are not provided, calculate them from the quiz results
  if (!categories) {
    categoryScores = {};

    // Only calculate recommendations if they weren't provided
    if (!providedRecommendations) {
      recommendations = [];
    }

    for (const question of quizData.questions) {
      const category = question.category || "General";
      const questionScore = processedResults[question.id] || 0;

      // Log if the question ID is not found in results
      if (processedResults[question.id] === undefined) {
        console.warn(`Question ID ${question.id} not found in results`);
      }

      const maxScore = Math.max(
        ...question.options.map((o) => {
          if (!("value" in o)) {
            console.warn(
              `Option in question ${question.id} does not have a value property:`,
              o
            );
          }
          return o.value;
        })
      );

      if (!categoryScores[category]) {
        categoryScores[category] = { total: 0, max: 0 };
      }

      categoryScores[category].total += questionScore;
      categoryScores[category].max += maxScore;

      // Add recommendation based on score only if recommendations weren't provided
      if (!providedRecommendations) {
        // Store the selected option for this question
        const selectedOption = question.options.find(
          (o) => o.value === questionScore
        );

        if (selectedOption) {
          const percentage = (questionScore / maxScore) * 100;
          let recommendation = "";

          if (quizData.id === "evaluacion-inicial") {
            if (percentage <= 20) {
              recommendation =
                "Requiere atención inmediata. Establezca controles básicos y políticas fundamentales.";
            } else if (percentage <= 40) {
              recommendation =
                "Necesita mejoras significativas. Formalice y documente los procesos existentes.";
            } else if (percentage <= 60) {
              recommendation =
                "En desarrollo. Optimice la aplicación de controles y mejore la supervisión.";
            } else if (percentage <= 80) {
              recommendation =
                "Bien establecido. Continue monitoreando y mejorando los procesos.";
            } else {
              recommendation =
                "Excelente. Mantenga el nivel y actualice según nuevas amenazas.";
            }
          } else {
            if (percentage <= 20) {
              recommendation =
                "Crítico: Implemente controles básicos siguiendo ISO 27001 y NIST.";
            } else if (percentage <= 40) {
              recommendation =
                "Importante: Estandarice procesos y documente políticas de seguridad.";
            } else if (percentage <= 60) {
              recommendation =
                "Moderado: Mejore la medición y optimización de controles existentes.";
            } else if (percentage <= 80) {
              recommendation =
                "Bueno: Implemente monitoreo avanzado y automatización de respuestas.";
            } else {
              recommendation =
                "Excelente: Mantenga la innovación y preparación ante amenazas emergentes.";
            }
          }

          recommendations.push({
            score: questionScore,
            maxScore,
            text: question.text,
            selectedOption:
              selectedOption.text ||
              selectedOption.label ||
              `Opción ${questionScore}`,
            category,
            recommendation,
          });
        }
      }

      // Log each question's score for debugging
      console.log(
        `Question ${question.id} (${category}): score=${questionScore}, maxScore=${maxScore}`
      );
    }

    // Calculate overall score
    overallScore = Object.values(categoryScores).reduce(
      (sum, { total }) => sum + total,
      0
    );
    maxPossibleScore = Object.values(categoryScores).reduce(
      (sum, { max }) => sum + max,
      0
    );
  }

  // Get category-specific maturity levels
  let categoryMaturityLevels;
  if (categories) {
    categoryMaturityLevels = categories.map(({ name, score, maxScore }) => ({
      category: name,
      maturityLevel: getMaturityLevel(quizData.id, score),
      total: score,
      max: maxScore,
    }));
  } else {
    categoryMaturityLevels = Object.entries(categoryScores).map(
      ([category, { total, max }]) => {
        const categoryScore = total;
        return {
          category,
          maturityLevel: getMaturityLevel(quizData.id, categoryScore),
          total,
          max,
        };
      }
    );
  }

  // Extract categories for specialist recommendations - get the lowest scoring categories
  const categoryScoresForSpecialists = categories
    ? categories.map(({ name, score, maxScore }) => ({
        category: name,
        percentage: Math.round((score / maxScore) * 100),
      }))
    : Object.entries(categoryScores).map(([category, { total, max }]) => ({
        category,
        percentage: Math.round((total / max) * 100),
      }));

  // Get the two lowest scoring categories (areas that need the most help)
  const calculatedWeakestCategories = [...categoryScoresForSpecialists]
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 2)
    .map((item) => item.category);

  // Inside the CybersecurityResults component
  // Extract the maturity level number (1-5) if it's not already provided
  const finalMaturityLevelNumber =
    maturityLevelNumber ||
    parseInt(maturity.level.split("–")[0].replace("Nivel ", "").trim(), 10);

  // Use the provided weakest categories if available, otherwise use the calculated ones
  const finalWeakestCategories =
    weakestCategories || calculatedWeakestCategories;

  // Now check specialists availability after we have the necessary variables
  useEffect(() => {
    const checkSpecialistsAvailability = async () => {
      setLoadingSpecialists(true);
      try {
        // First check if user is authenticated
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          // User is not logged in, don't try to fetch specialists
          console.log("User not authenticated, skipping specialists check");
          setSpecialistsAvailable(false);
          setLoadingSpecialists(false);
          return;
        }

        const categoriesParam =
          finalWeakestCategories.length > 0
            ? `&categories=${finalWeakestCategories.join(",")}`
            : "";

        const url = `/api/specialists/recommended?level=${finalMaturityLevelNumber}${categoriesParam}`;
        console.log("Checking specialists availability at URL:", url);

        try {
          const response = await fetch(url);

          if (!response.ok) {
            console.log("Specialists API returned status:", response.status);
            setSpecialistsAvailable(false);
            return;
          }

          const responseData = await response.json();
          console.log("Specialists availability check response:", responseData);
          console.log("Specialists length:", responseData.length);
          setSpecialistsAvailable(responseData && responseData.length > 0);
        } catch (fetchError) {
          console.log("Error fetching specialists:", fetchError);
          setSpecialistsAvailable(false);
        }
      } catch (err) {
        console.log("Error in specialists availability check:", err);
        setSpecialistsAvailable(false);
      } finally {
        setLoadingSpecialists(false);
      }
    };

    if (finalMaturityLevelNumber && finalWeakestCategories) {
      checkSpecialistsAvailability();
    } else {
      console.log("Missing maturity level or categories for specialists check");
      setSpecialistsAvailable(false);
      setLoadingSpecialists(false);
    }
  }, [finalMaturityLevelNumber, finalWeakestCategories, supabase]);

  // Calculate overall percentage early in the component
  // After maturity is defined, add an overall percentage calculation for use with colors
  const overallPercentage = Math.round(
    (overallScore /
      (quizData.id === "evaluacion-avanzada" ? 100 : maxPossibleScore)) *
      100
  );

  // Add a capped percentage for display purposes
  const displayPercentage = Math.min(overallPercentage, 100);

  // Define color helper function
  const getColorByPercentage = (percentage: number) => {
    if (percentage <= 20)
      return {
        color: "text-red-600",
        bg: "bg-red-600",
        bgLight: "bg-red-100",
        emoji: "🔴",
      };
    if (percentage <= 40)
      return {
        color: "text-orange-600",
        bg: "bg-orange-600",
        bgLight: "bg-orange-100",
        emoji: "🟠",
      };
    if (percentage <= 60)
      return {
        color: "text-yellow-600",
        bg: "bg-yellow-600",
        bgLight: "bg-yellow-100",
        emoji: "🟡",
      };
    if (percentage <= 80)
      return {
        color: "text-green-600",
        bg: "bg-green-600",
        bgLight: "bg-green-100",
        emoji: "🟢",
      };
    return {
      color: "text-blue-600",
      bg: "bg-blue-600",
      bgLight: "bg-blue-100",
      emoji: "🔵",
    };
  };

  const scoreColor = getColorByPercentage(displayPercentage);

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {!hideHeader && (
        <header className="p-3 bg-white border-b">
          <div className="container flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={isSharedView ? "/dashboard" : "/"}>
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {isSharedView ? "Dashboard" : "Volver"}
                </Button>
              </Link>
              <h1 className="text-lg font-semibold">
                Resultados de {quizData?.title || "la evaluación"}
              </h1>
            </div>
            <div className="text-sm text-muted-foreground">
              {userInfo.firstName} {userInfo.lastName}
            </div>
          </div>
        </header>
      )}

      <main className={cn("flex-grow", isSharedView ? "p-4 md:p-8" : "p-0")}>
        <div className={cn("mx-auto", isSharedView ? "max-w-3xl" : "w-full")}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {isSharedView && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">
                  {userInfo.firstName}, aquí están sus resultados
                </h1>
                <p className="text-lg text-gray-600">
                  Evaluación de Madurez en Ciberseguridad
                </p>
              </div>
            )}
            {/* Advanced Evaluation CTA for initial evaluation */}
            {quizData.id === "evaluacion-inicial" && (
              <div className="mt-8 bg-gradient-to-r from-yellow-50 to-amber-50 p-8 rounded-xl shadow-md border-2 border-yellow-400 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-40 h-40 bg-yellow-300 opacity-20 rounded-full"></div>
                <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-yellow-300 opacity-10 rounded-full"></div>
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                  <div className="flex-shrink-0 bg-yellow-400 rounded-full p-4 w-20 h-20 flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-black"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">
                      ⚠️ Esto es solo un diagnóstico básico ⚠️
                    </h3>
                    <p className="text-gray-700 mb-3">
                      <strong className="text-yellow-700">IMPORTANTE:</strong>{" "}
                      Esta evaluación inicial muestra solo una visión parcial y
                      limitada de su seguridad. Para obtener una evaluación
                      completa y profesional, recomendamos nuestra evaluación
                      avanzada que incluye:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="bg-white bg-opacity-70 text-yellow-800 px-4 py-3 rounded-lg text-sm flex items-start border border-yellow-300">
                        <span className="text-xl mr-2">✓</span>
                        <span>25 preguntas completas y profundizadas</span>
                      </div>
                      <div className="bg-white bg-opacity-70 text-yellow-800 px-4 py-3 rounded-lg text-sm flex items-start border border-yellow-300">
                        <span className="text-xl mr-2">✓</span>
                        <span>Análisis basado en ISO 27001 y NIST</span>
                      </div>
                      <div className="bg-white bg-opacity-70 text-yellow-800 px-4 py-3 rounded-lg text-sm flex items-start border border-yellow-300">
                        <span className="text-xl mr-2">✓</span>
                        <span>Plan de acción detallado y personalizado</span>
                      </div>
                      <div className="bg-white bg-opacity-70 text-yellow-800 px-4 py-3 rounded-lg text-sm flex items-start border border-yellow-300">
                        <span className="text-xl mr-2">✓</span>
                        <span>Acceso al dashboard de seguridad</span>
                      </div>
                    </div>
                    <Link href="/pricing">
                      <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-6 px-8 rounded-full shadow-md">
                        Actualizar a evaluación avanzada
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold mb-8 text-gray-800">
                Resumen General
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Puntuación Total
                  </p>
                  <p className={`text-4xl font-bold ${scoreColor.color}`}>
                    {quizData.id === "evaluacion-inicial"
                      ? Math.min(overallScore, maxPossibleScore)
                      : overallScore}
                    /
                    {quizData.id === "evaluacion-avanzada"
                      ? 100
                      : maxPossibleScore}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {displayPercentage > 100 ? 100 : displayPercentage}% de
                    madurez
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Nivel de Madurez
                  </p>
                  <p
                    className={`text-4xl font-bold ${scoreColor.color} flex items-center gap-3`}
                  >
                    <span>{scoreColor.emoji}</span>
                    <span>Nivel {maturity.level.replace("Nivel ", "")}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {maturity.description}
                  </p>
                </div>
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span
                      className={`${scoreColor.color} font-semibold inline-block py-1 px-2 uppercase rounded-full text-xs`}
                    >
                      PROGRESO
                    </span>
                  </div>
                  <div className={`${scoreColor.color} text-right`}>
                    <span className="text-xs font-semibold inline-block">
                      {displayPercentage}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={displayPercentage}
                  className={cn(
                    "h-2.5",
                    displayPercentage <= 20
                      ? "bg-red-100 [&>div]:bg-red-600"
                      : displayPercentage <= 40
                        ? "bg-orange-100 [&>div]:bg-orange-600"
                        : displayPercentage <= 60
                          ? "bg-yellow-100 [&>div]:bg-yellow-600"
                          : displayPercentage <= 80
                            ? "bg-green-100 [&>div]:bg-green-600"
                            : "bg-blue-100 [&>div]:bg-blue-600"
                  )}
                />
              </div>
            </div>

            <div className={cn("p-6 rounded-lg shadow-sm", "bg-white")}>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Nivel de Madurez Actual
              </h2>
              <div
                className={cn(
                  "p-5 rounded-lg border",
                  displayPercentage <= 20
                    ? "border-red-600"
                    : displayPercentage <= 40
                      ? "border-orange-600"
                      : displayPercentage <= 60
                        ? "border-yellow-600"
                        : displayPercentage <= 80
                          ? "border-green-600"
                          : "border-blue-600"
                )}
              >
                <p
                  className={`${
                    displayPercentage <= 20
                      ? "text-red-600"
                      : displayPercentage <= 40
                        ? "text-orange-600"
                        : displayPercentage <= 60
                          ? "text-yellow-600"
                          : displayPercentage <= 80
                            ? "text-green-600"
                            : "text-blue-600"
                  } font-medium mb-4`}
                >
                  {maturity.description}
                </p>

                {/* Detailed maturity level description and recommendation based on evaluation type */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {quizData.id === "evaluacion-inicial" ? (
                    <>
                      <p className="text-sm text-gray-600 mb-3">
                        {overallScore <= 9 && (
                          <>
                            No hay un enfoque estructurado de ciberseguridad.
                            Los controles son inexistentes o informales. Se
                            requiere establecer procesos y medidas de seguridad
                            básicas. Te podemos apoyar en subir este nivel de
                            madurez hacerlo solo toma más tiempo.
                          </>
                        )}
                        {overallScore >= 10 && overallScore <= 19 && (
                          <>
                            Existen algunos controles de ciberseguridad, pero no
                            están formalizados ni aplicados de manera
                            consistente. Aún se depende de acciones individuales
                            y no hay gestión centralizada. Para validar tu
                            estado de seguridad, Ciberseguridad Simple puede
                            realizar una auditoría y verificación de
                            documentación, controles y riesgos.
                          </>
                        )}
                        {overallScore >= 20 && overallScore <= 29 && (
                          <>
                            La organización cuenta con políticas y procesos
                            documentados de ciberseguridad. Hay roles definidos,
                            pero aún falta optimizar la aplicación y supervisión
                            de estos controles. Se recomienda una verificación
                            con Ciberseguridad Simple para revisar
                            documentación, procesos y riesgos clave.
                          </>
                        )}
                        {overallScore >= 30 && overallScore <= 39 && (
                          <>
                            La ciberseguridad se gestiona activamente con
                            métricas, auditorías y monitoreo continuo. Se
                            aplican mejoras constantes, pero hay oportunidades
                            de optimización en procesos críticos. Se recomienda
                            una verificación con Ciberseguridad Simple para
                            revisar documentación, procesos y riesgos clave.
                          </>
                        )}
                        {overallScore >= 40 && overallScore <= 44 && (
                          <>
                            La ciberseguridad está en un nivel avanzado con
                            controles implementados y revisados periódicamente.
                            Se han adoptado procesos de mejora continua, aunque
                            aún pueden fortalecerse ciertos aspectos
                            estratégicos. Se recomienda una verificación con
                            Ciberseguridad Simple para evaluar la efectividad de
                            los controles, revisar la documentación de seguridad
                            y validar la gestión de riesgos.
                          </>
                        )}
                        {overallScore === 45 && (
                          <>
                            La ciberseguridad es robusta y completamente
                            integrada en la organización. Se han automatizado
                            procesos, gestionado proactivamente los riesgos y
                            optimizado los controles. Sin embargo, siempre hay
                            margen de evolución ante nuevas amenazas. Para
                            validar tu estado de seguridad, Ciberseguridad
                            Simple puede realizar una auditoría y verificación
                            de documentación, controles y riesgos.
                          </>
                        )}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-2">
                        {overallScore <= 20 && (
                          <>
                            <span className="block mb-2">
                              La seguridad se maneja de forma reactiva. No hay
                              procesos documentados ni una estructura clara para
                              gestionar riesgos y proteger la información.
                            </span>
                            <span className="block mt-3 font-medium text-red-600">
                              🛑 Consejo: Trabaja en establecer una estrategia
                              inicial de seguridad, enfocada en definir
                              políticas, roles y procesos básicos para proteger
                              la información. ISO 27001 y NIST recomiendan
                              empezar con la identificación de activos y
                              riesgos.
                            </span>
                          </>
                        )}
                        {overallScore >= 21 && overallScore <= 45 && (
                          <>
                            <span className="block mb-2">
                              ⚠️ Existen controles básicos, pero su aplicación
                              no es uniforme. La seguridad depende de esfuerzos
                              individuales y acciones aisladas en lugar de
                              procesos bien definidos.
                            </span>
                            <span className="block mt-3 font-medium text-orange-600">
                              🔄 Consejo: Estandariza y documenta las políticas
                              de seguridad, asegurando que sean aplicadas en
                              toda la organización. Trabaja en la gestión de
                              riesgos y en el uso de controles técnicos
                              recomendados por CIS Controls y NIST CSF.
                            </span>
                          </>
                        )}
                        {overallScore >= 46 && overallScore <= 68 && (
                          <>
                            <span className="block mb-2">
                              📋 Los procesos de ciberseguridad están
                              estructurados y alineados con estándares como ISO
                              27001, NIST y CIS. Se han implementado controles
                              en la nube, gestión de vulnerabilidades y
                              auditorías.
                            </span>
                            <span className="block mt-3 font-medium text-yellow-600">
                              📊 Consejo: Profundiza en la medición y
                              optimización de los controles, con el uso de
                              monitoreo continuo y métricas de seguridad.
                              Explora herramientas de Zero Trust, segmentación
                              de red y pruebas de seguridad en aplicaciones
                              (DevSecOps, OWASP ASVS).
                            </span>
                          </>
                        )}
                        {overallScore >= 69 && overallScore <= 88 && (
                          <>
                            <span className="block mb-2">
                              🏢 La ciberseguridad es gestionada con métricas,
                              auditorías y monitoreo activo. Se han implementado
                              SOC, SIEM, análisis de amenazas y simulaciones de
                              incidentes (Red Team, Blue Team).
                            </span>
                            <span className="block mt-3 font-medium text-green-600">
                              📈 Consejo: Asegura la mejora continua en la
                              gestión de incidentes y la resiliencia
                              organizacional. Refuerza el uso de inteligencia de
                              amenazas (OSINT, Dark Web Monitoring) y la
                              automatización de respuestas a incidentes (SOAR,
                              XDR).
                            </span>
                          </>
                        )}
                        {overallScore >= 89 && overallScore <= 99 && (
                          <>
                            <span className="block mb-2">
                              🤖 Ciberseguridad avanzada con procesos
                              automatizados y monitoreo en tiempo real. Se han
                              adoptado estrategias como Zero Trust, detección de
                              amenazas con IA y seguridad en la nube con
                              cumplimiento de marcos como AWS Well-Architected,
                              Google Cloud Security y Azure Security Center.
                            </span>
                            <span className="block mt-3 font-medium text-blue-600">
                              🔐 Consejo: Sigue fortaleciendo la estrategia de
                              seguridad con ciberinteligencia y automatización.
                              Evalúa constantemente nuevas tecnologías, mejora
                              la gestión de crisis y resiliencia y optimiza los
                              procesos de respuesta a incidentes con IA.
                            </span>
                          </>
                        )}
                        {overallScore === 100 && (
                          <>
                            <span className="block mb-2">
                              🏅 Ciberseguridad completamente integrada en la
                              cultura organizacional. Se han implementado
                              detección de amenazas con IA, automatización total
                              de respuesta a incidentes, monitoreo continuo de
                              la Dark Web y cumplimiento avanzado de seguridad
                              en entornos híbridos y en la nube.
                            </span>
                            <span className="block mt-3 font-medium text-blue-600">
                              💡 Consejo: Se nota que has trabajado en
                              ciberseguridad y dominas los estándares. Mantén un
                              enfoque en innovación y evolución, asegurando que
                              el equipo y la organización estén preparados para
                              amenazas emergentes. Continúa reforzando la
                              estrategia con simulaciones avanzadas y escenarios
                              de crisis en entornos reales.
                            </span>
                          </>
                        )}
                      </p>
                    </>
                  )}
                </div>

                {maturity.advice && (
                  <>
                    <h3
                      className={`font-semibold mt-4 mb-2 ${
                        displayPercentage <= 20
                          ? "text-red-600"
                          : displayPercentage <= 40
                            ? "text-orange-600"
                            : displayPercentage <= 60
                              ? "text-yellow-600"
                              : displayPercentage <= 80
                                ? "text-green-600"
                                : "text-blue-600"
                      }`}
                    >
                      Recomendación General
                    </h3>
                    <p
                      className={`${
                        displayPercentage <= 20
                          ? "text-red-600"
                          : displayPercentage <= 40
                            ? "text-orange-600"
                            : displayPercentage <= 60
                              ? "text-yellow-600"
                              : displayPercentage <= 80
                                ? "text-green-600"
                                : "text-blue-600"
                      }`}
                    >
                      {maturity.advice}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-8 mb-10">
              <Collapsible className="w-full">
                <Card className="overflow-hidden bg-white">
                  <motion.div
                    className="p-4 bg-white border-b border-[hsl(var(--border))]"
                    whileHover={{
                      cursor: "pointer",
                      backgroundColor: "hsl(var(--secondary))",
                    }}
                  >
                    <CollapsibleTrigger asChild className="w-full">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <motion.div
                              className="h-12 w-12 rounded-full bg-gradient-to-r from-[hsl(var(--chart-1))] to-[hsl(var(--chart-2))] flex items-center justify-center shadow-md animate-orange-yellow-gradient"
                              animate={{
                                scale: [1, 1.1, 1],
                                boxShadow: [
                                  "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                  "0 4px 12px -1px rgba(0, 0, 0, 0.2)",
                                  "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                ],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 2,
                              }}
                            >
                              <motion.div
                                animate={{
                                  rotate: [0, 15, 0, -15, 0],
                                }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 2,
                                  repeatDelay: 0.5,
                                }}
                              >
                                <ChevronDown className="h-6 w-6 text-white" />
                              </motion.div>
                            </motion.div>
                            <motion.div
                              className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[hsl(var(--chart-4))]"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [1, 0.8, 1],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                delay: 0.5,
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-[hsl(var(--foreground))] bg-gradient-to-r from-[hsl(var(--chart-3))] to-[hsl(var(--chart-4))] bg-clip-text text-transparent">
                              ¿Qué niveles de madurez hay y qué significan?
                            </h3>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                              Haz clic para explorar los estándares de madurez
                              según ISO 27001
                            </p>
                          </div>
                        </div>
                        <div className="text-black font-medium text-sm flex items-center">
                          <span>Ver detalles</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                  </motion.div>
                  <CollapsibleContent>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="p-6">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="font-medium w-[150px]">
                                  {quizData.id === "evaluacion-inicial"
                                    ? "Puntuación (Máx. 45 pts)"
                                    : "Puntuación Total (Máx. 100 puntos)"}
                                </TableHead>
                                <TableHead className="font-medium w-[200px]">
                                  Nivel de Madurez ISO 27001
                                </TableHead>
                                <TableHead className="font-medium">
                                  Descripción
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {quizData.id === "evaluacion-inicial" ? (
                                <>
                                  <TableRow
                                    className={cn(
                                      overallScore >= 0 &&
                                        overallScore <= 9 &&
                                        "bg-red-50"
                                    )}
                                  >
                                    <TableCell className="font-medium">
                                      0 - 9
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-red-600 flex-shrink-0"></div>
                                        <span>Nivel 1 – Inicial / Ad-hoc</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <p>
                                        No hay un enfoque estructurado de
                                        ciberseguridad. Los controles son
                                        inexistentes o informales. Se requiere
                                        establecer procesos y medidas de
                                        seguridad básicas.
                                      </p>
                                      <p className="text-red-600 mt-1 text-sm">
                                        Te podemos apoyar en subir este nivel de
                                        madurez hacerlo solo toma más tiempo.
                                      </p>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow
                                    className={cn(
                                      overallScore >= 10 &&
                                        overallScore <= 19 &&
                                        "bg-orange-50"
                                    )}
                                  >
                                    <TableCell className="font-medium">
                                      10 - 19
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-orange-600 flex-shrink-0"></div>
                                        <span>
                                          Nivel 2 – Repetible pero intuitivo
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      Existen algunos controles de
                                      ciberseguridad, pero no están formalizados
                                      ni aplicados de manera consistente. Aún se
                                      depende de acciones individuales y no hay
                                      gestión centralizada. Para validar tu
                                      estado de seguridad, Ciberseguridad Simple
                                      puede realizar una auditoría y
                                      verificación de documentación, controles y
                                      riesgos.
                                    </TableCell>
                                  </TableRow>
                                  <TableRow
                                    className={cn(
                                      overallScore >= 20 &&
                                        overallScore <= 29 &&
                                        "bg-yellow-50"
                                    )}
                                  >
                                    <TableCell className="font-medium">
                                      20 - 29
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-yellow-600 flex-shrink-0"></div>
                                        <span>Nivel 3 – Definido</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <p>
                                        La organización cuenta con políticas y
                                        procesos documentados de ciberseguridad.
                                        Hay roles definidos, pero aún falta
                                        optimizar la aplicación y supervisión de
                                        estos controles.
                                      </p>
                                      <p className="font-medium mt-1 text-sm">
                                        Se recomienda una verificación con
                                        Ciberseguridad Simple para revisar
                                        documentación, procesos y riesgos clave.
                                      </p>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow
                                    className={cn(
                                      overallScore >= 30 &&
                                        overallScore <= 39 &&
                                        "bg-green-50"
                                    )}
                                  >
                                    <TableCell className="font-medium">
                                      30 - 39
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-green-600 flex-shrink-0"></div>
                                        <span>
                                          Nivel 4 – Gestionado y Medido
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      La ciberseguridad se gestiona activamente
                                      con métricas, auditorías y monitoreo
                                      continuo. Se aplican mejoras constantes,
                                      pero hay oportunidades de optimización en
                                      procesos críticos. Se recomienda una
                                      verificación con Ciberseguridad Simple
                                      para revisar documentación, procesos y
                                      riesgos clave.
                                    </TableCell>
                                  </TableRow>
                                  <TableRow
                                    className={cn(
                                      overallScore >= 40 &&
                                        overallScore <= 44 &&
                                        "bg-blue-50"
                                    )}
                                  >
                                    <TableCell className="font-medium">
                                      40 - 44
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-blue-600 flex-shrink-0"></div>
                                        <span>Nivel 5 – Optimizado</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      La ciberseguridad está en un nivel
                                      avanzado con controles implementados y
                                      revisados periódicamente. Se han adoptado
                                      procesos de mejora continua, aunque aún
                                      pueden fortalecerse ciertos aspectos
                                      estratégicos. Se recomienda una
                                      verificación con Ciberseguridad Simple
                                      para evaluar la efectividad de los
                                      controles, revisar la documentación de
                                      seguridad y validar la gestión de riesgos.
                                    </TableCell>
                                  </TableRow>
                                  <TableRow
                                    className={cn(
                                      overallScore === 45 && "bg-blue-50"
                                    )}
                                  >
                                    <TableCell className="font-medium">
                                      45
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-blue-600 flex-shrink-0"></div>
                                        <span>Nivel 5 – Óptimo</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      La ciberseguridad es robusta y
                                      completamente integrada en la
                                      organización. Se han automatizado
                                      procesos, gestionado proactivamente los
                                      riesgos y optimizado los controles. Sin
                                      embargo, siempre hay margen de evolución
                                      ante nuevas amenazas. Para validar tu
                                      estado de seguridad, Ciberseguridad Simple
                                      puede realizar una auditoría y
                                      verificación de documentación, controles y
                                      riesgos.
                                    </TableCell>
                                  </TableRow>
                                </>
                              ) : (
                                <>
                                  <TableRow
                                    className={cn(
                                      overallScore >= 0 &&
                                        overallScore <= 20 &&
                                        "bg-red-50"
                                    )}
                                  >
                                    <TableCell className="font-medium">
                                      0 - 20
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-red-600 flex-shrink-0"></div>
                                        <span>Nivel 1 – Inicial / Ad-hoc</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <p>
                                        La seguridad se maneja de forma
                                        reactiva. No hay procesos documentados
                                        ni una estructura clara para gestionar
                                        riesgos y proteger la información.
                                      </p>
                                      <p className="mt-1 text-sm">
                                        <span className="text-red-600 font-medium">
                                          🛑 Consejo:
                                        </span>{" "}
                                        Trabaja en establecer una estrategia
                                        inicial de seguridad, enfocada en
                                        definir políticas, roles y procesos
                                        básicos para proteger la información.
                                        ISO 27001 y NIST recomiendan empezar con
                                        la identificación de activos y riesgos.
                                      </p>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow
                                    className={cn(
                                      overallScore >= 21 &&
                                        overallScore <= 40 &&
                                        "bg-orange-50"
                                    )}
                                  >
                                    <TableCell className="font-medium">
                                      21 - 40
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-orange-600 flex-shrink-0"></div>
                                        <span>
                                          Nivel 2 – Repetible pero intuitivo
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <p>
                                        ⚠️ Existen controles básicos, pero su
                                        aplicación no es uniforme. La seguridad
                                        depende de esfuerzos individuales y
                                        acciones aisladas en lugar de procesos
                                        bien definidos.
                                      </p>
                                      <p className="mt-1 text-sm">
                                        <span className="text-orange-600 font-medium">
                                          🔄 Consejo:
                                        </span>{" "}
                                        Estandariza y documenta las políticas de
                                        seguridad, asegurando que sean aplicadas
                                        en toda la organización. Trabaja en la
                                        gestión de riesgos y en el uso de
                                        controles técnicos recomendados por CIS
                                        Controls y NIST CSF.
                                      </p>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow
                                    className={cn(
                                      overallScore >= 41 &&
                                        overallScore <= 60 &&
                                        "bg-yellow-50"
                                    )}
                                  >
                                    <TableCell className="font-medium">
                                      41 - 60
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-yellow-600 flex-shrink-0"></div>
                                        <span>Nivel 3 – Definido</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <p>
                                        📋 Los procesos de ciberseguridad están
                                        estructurados y alineados con estándares
                                        como ISO 27001, NIST y CIS. Se han
                                        implementado controles en la nube,
                                        gestión de vulnerabilidades y
                                        auditorías.
                                      </p>
                                      <p className="mt-1 text-sm">
                                        <span className="text-yellow-600 font-medium">
                                          📊 Consejo:
                                        </span>{" "}
                                        Profundiza en la medición y optimización
                                        de los controles, con el uso de
                                        monitoreo continuo y métricas de
                                        seguridad. Explora herramientas de Zero
                                        Trust, segmentación de red y pruebas de
                                        seguridad en aplicaciones (DevSecOps,
                                        OWASP ASVS).
                                      </p>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow
                                    className={cn(
                                      overallScore >= 61 &&
                                        overallScore <= 80 &&
                                        "bg-green-50"
                                    )}
                                  >
                                    <TableCell className="font-medium">
                                      61 - 80
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-green-600 flex-shrink-0"></div>
                                        <span>
                                          Nivel 4 – Gestionado y Medido
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <p>
                                        🏢 La ciberseguridad es gestionada con
                                        métricas, auditorías y monitoreo activo.
                                        Se han implementado SOC, SIEM, análisis
                                        de amenazas y simulaciones de incidentes
                                        (Red Team, Blue Team).
                                      </p>
                                      <p className="mt-1 text-sm">
                                        <span className="text-green-600 font-medium">
                                          📈 Consejo:
                                        </span>{" "}
                                        Asegura la mejora continua en la gestión
                                        de incidentes y la resiliencia
                                        organizacional. Refuerza el uso de
                                        inteligencia de amenazas (OSINT, Dark
                                        Web Monitoring) y la automatización de
                                        respuestas a incidentes (SOAR, XDR).
                                      </p>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow
                                    className={cn(
                                      overallScore >= 81 &&
                                        overallScore <= 99 &&
                                        "bg-blue-50"
                                    )}
                                  >
                                    <TableCell className="font-medium">
                                      81 - 99
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-blue-600 flex-shrink-0"></div>
                                        <span>Nivel 5 – Optimizado</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <p>
                                        🤖 Ciberseguridad avanzada con procesos
                                        automatizados y monitoreo en tiempo
                                        real. Se han adoptado estrategias como
                                        Zero Trust, detección de amenazas con IA
                                        y seguridad en la nube con cumplimiento
                                        de marcos como AWS Well-Architected,
                                        Google Cloud Security y Azure Security
                                        Center.
                                      </p>
                                      <p className="mt-1 text-sm">
                                        <span className="text-blue-600 font-medium">
                                          🔐 Consejo:
                                        </span>{" "}
                                        Sigue fortaleciendo la estrategia de
                                        seguridad con ciberinteligencia y
                                        automatización. Evalúa constantemente
                                        nuevas tecnologías, mejora la gestión de
                                        crisis y resiliencia y optimiza los
                                        procesos de respuesta a incidentes con
                                        IA.
                                      </p>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow
                                    className={cn(
                                      overallScore === 100 && "bg-blue-50"
                                    )}
                                  >
                                    <TableCell className="font-medium">
                                      100
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-blue-600 flex-shrink-0"></div>
                                        <span>Nivel 5 – Óptimo</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <p>
                                        🏅 Ciberseguridad completamente
                                        integrada en la cultura organizacional.
                                        Se han implementado detección de
                                        amenazas con IA, automatización total de
                                        respuesta a incidentes, monitoreo
                                        continuo de la Dark Web y cumplimiento
                                        avanzado de seguridad en entornos
                                        híbridos y en la nube.
                                      </p>
                                      <p className="mt-1 text-sm">
                                        <span className="text-blue-600 font-medium">
                                          💡 Consejo:
                                        </span>{" "}
                                        Se nota que has trabajado en
                                        ciberseguridad y dominas los estándares.
                                        Mantén un enfoque en innovación y
                                        evolución, asegurando que el equipo y la
                                        organización estén preparados para
                                        amenazas emergentes. Continúa reforzando
                                        la estrategia con simulaciones avanzadas
                                        y escenarios de crisis en entornos
                                        reales.
                                      </p>
                                    </TableCell>
                                  </TableRow>
                                </>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </motion.div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold mb-8 text-gray-800">
                Desglose por Categoría y Recomendaciones
              </h2>

              {/* Show categories one by one with their questions */}
              <div className="space-y-8">
                {categoryMaturityLevels.map(({ category, total, max }) => {
                  const percentage = Math.round((total / max) * 100);
                  // Get all recommendations for this category
                  const categoryRecommendations = recommendations.filter(
                    (rec) => rec.category === category
                  );

                  return (
                    <div key={category} className="space-y-4">
                      {/* Category heading and score */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3
                            className={`text-lg font-semibold ${
                              percentage <= 20
                                ? "text-red-600"
                                : percentage <= 40
                                  ? "text-orange-600"
                                  : percentage <= 60
                                    ? "text-yellow-600"
                                    : percentage <= 80
                                      ? "text-green-600"
                                      : "text-blue-600"
                            }`}
                          >
                            {category}{" "}
                            {percentage <= 20
                              ? "🔴"
                              : percentage <= 40
                                ? "🟠"
                                : percentage <= 60
                                  ? "🟡"
                                  : percentage <= 80
                                    ? "🟢"
                                    : "🔵"}
                          </h3>
                          <span className="text-sm font-medium text-gray-600">
                            {total}/{max} ({percentage}%)
                          </span>
                        </div>
                        <Progress
                          value={percentage}
                          className={cn(
                            "h-2.5",
                            percentage <= 20
                              ? "bg-red-100 [&>div]:bg-red-600"
                              : percentage <= 40
                                ? "bg-orange-100 [&>div]:bg-orange-600"
                                : percentage <= 60
                                  ? "bg-yellow-100 [&>div]:bg-yellow-600"
                                  : percentage <= 80
                                    ? "bg-green-100 [&>div]:bg-green-600"
                                    : "bg-blue-100 [&>div]:bg-blue-600"
                          )}
                        />
                        <div className="flex justify-end mt-1">
                          <span
                            className={`text-xs ${
                              percentage <= 20
                                ? "text-red-600"
                                : percentage <= 40
                                  ? "text-orange-600"
                                  : percentage <= 60
                                    ? "text-yellow-600"
                                    : percentage <= 80
                                      ? "text-green-600"
                                      : "text-blue-600"
                            }`}
                          >
                            {percentage <= 20
                              ? "Crítico"
                              : percentage <= 40
                                ? "Básico"
                                : percentage <= 60
                                  ? "Intermedio"
                                  : percentage <= 80
                                    ? "Bueno"
                                    : "Excelente"}
                          </span>
                        </div>
                      </div>

                      {/* Questions in this category */}
                      <div className="pl-2 border-l-2 ml-2 space-y-4">
                        {categoryRecommendations.map((rec) => {
                          const questionPercentage = Math.round(
                            (rec.score / rec.maxScore) * 100
                          );

                          return (
                            <div
                              key={`${rec.category}-${rec.text}`}
                              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800 text-sm">
                                    {rec.text}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    Respuesta: {rec.selectedOption}
                                  </p>
                                </div>
                                <div className="text-right ml-4 flex-shrink-0">
                                  <div
                                    className={`text-sm font-medium ${
                                      questionPercentage <= 20
                                        ? "text-red-600"
                                        : questionPercentage <= 40
                                          ? "text-orange-600"
                                          : questionPercentage <= 60
                                            ? "text-yellow-600"
                                            : questionPercentage <= 80
                                              ? "text-green-600"
                                              : "text-blue-600"
                                    }`}
                                  >
                                    {rec.score}/{rec.maxScore}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {questionPercentage}%
                                  </div>
                                </div>
                              </div>

                              {/* Add progress bar for individual question score */}
                              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
                                <div
                                  className={`h-full rounded-full ${
                                    questionPercentage <= 20
                                      ? "bg-red-600"
                                      : questionPercentage <= 40
                                        ? "bg-orange-600"
                                        : questionPercentage <= 60
                                          ? "bg-yellow-600"
                                          : questionPercentage <= 80
                                            ? "bg-green-600"
                                            : "bg-blue-600"
                                  }`}
                                  style={{ width: `${questionPercentage}%` }}
                                ></div>
                              </div>

                              <div
                                className={`mt-3 pt-3 border-t border-gray-200 ${
                                  questionPercentage <= 20
                                    ? "bg-red-50"
                                    : questionPercentage <= 40
                                      ? "bg-orange-50"
                                      : questionPercentage <= 60
                                        ? "bg-yellow-50"
                                        : questionPercentage <= 80
                                          ? "bg-green-50"
                                          : "bg-blue-50"
                                } rounded-b-lg -mx-4 -mb-4 px-4 pb-4`}
                              >
                                <p className="text-xs font-medium text-gray-700 flex items-center">
                                  <span
                                    className={`inline-block h-2 w-2 rounded-full mr-2 ${
                                      questionPercentage <= 20
                                        ? "bg-red-600"
                                        : questionPercentage <= 40
                                          ? "bg-orange-600"
                                          : questionPercentage <= 60
                                            ? "bg-yellow-600"
                                            : questionPercentage <= 80
                                              ? "bg-green-600"
                                              : "bg-blue-600"
                                    }`}
                                  ></span>
                                  <span
                                    className={`${
                                      questionPercentage <= 20
                                        ? "text-red-600"
                                        : questionPercentage <= 40
                                          ? "text-orange-600"
                                          : questionPercentage <= 60
                                            ? "text-yellow-600"
                                            : questionPercentage <= 80
                                              ? "text-green-600"
                                              : "text-blue-600"
                                    }`}
                                  >
                                    {questionPercentage <= 40
                                      ? "Acción prioritaria"
                                      : questionPercentage <= 70
                                        ? "Acción recomendada"
                                        : "Mantener"}
                                  </span>
                                </p>
                                <p
                                  className={`text-xs leading-relaxed mt-1 ${
                                    questionPercentage <= 40
                                      ? "font-medium"
                                      : "font-normal"
                                  }`}
                                >
                                  {rec.recommendation}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Call to Action Banner - Moved to bottom of page */}
            <div
              className={cn(
                "p-6 rounded-xl text-white shadow-lg border transform hover:scale-[1.02] transition-all duration-300",
                displayPercentage <= 20
                  ? "bg-gradient-to-r from-red-500 to-red-600 border-red-300"
                  : displayPercentage <= 40
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-300"
                    : displayPercentage <= 60
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-300"
                      : displayPercentage <= 80
                        ? "bg-gradient-to-r from-green-500 to-green-600 border-green-300"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-300"
              )}
            >
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-shrink-0 mb-4 md:mb-0">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">
                    ¡Mejora tu nivel de ciberseguridad ahora!
                  </h3>
                  <p className="mb-2 max-w-lg">
                    Nuestros especialistas pueden ayudarte a implementar las
                    medidas necesarias para proteger tu organización de amenazas
                    cibernéticas.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start text-sm font-medium mt-1 mb-3">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      Asesoría personalizada
                    </span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      Implementación de controles
                    </span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      Análisis de vulnerabilidades
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <a
                    href="mailto:contacto@ciberseguridadsimple.com"
                    className="inline-block"
                  >
                    <Button
                      className={cn(
                        "bg-white px-6 py-6 shadow-md font-bold rounded-full flex gap-2 items-center",
                        displayPercentage <= 20
                          ? "text-red-600 hover:bg-red-50"
                          : displayPercentage <= 40
                            ? "text-orange-600 hover:bg-orange-50"
                            : displayPercentage <= 60
                              ? "text-yellow-600 hover:bg-yellow-50"
                              : displayPercentage <= 80
                                ? "text-green-600 hover:bg-green-50"
                                : "text-blue-600 hover:bg-blue-50"
                      )}
                    >
                      Contactar Especialista
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {!loadingSpecialists && specialistsAvailable && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <SpecialistsRecommendations
                  maturityLevel={finalMaturityLevelNumber}
                  categories={finalWeakestCategories}
                />
              </div>
            )}

            {!isSharedView && onRestart && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={onRestart}
                  className={`${
                    displayPercentage <= 20
                      ? "bg-red-600"
                      : displayPercentage <= 40
                        ? "bg-orange-600"
                        : displayPercentage <= 60
                          ? "bg-yellow-600"
                          : displayPercentage <= 80
                            ? "bg-green-600"
                            : "bg-blue-600"
                  } text-white hover:opacity-90 rounded-full px-8 py-6`}
                >
                  Realizar otra evaluación
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
