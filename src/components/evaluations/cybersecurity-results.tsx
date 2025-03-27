"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type {
  QuizData,
  QuizResults,
  UserInfo,
  CybersecurityInterest as InterestType,
  InterestOption,
} from "./types";
import { SimpleHeader } from "@/components/ui/simple-header";
import { cn } from "@/lib/utils";
import { SpecialistsRecommendations } from "./specialists-recommendations";
import Link from "next/link";

interface MaturityLevel {
  level: string;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
  advice?: string;
}

interface CybersecurityResultsProps {
  quizData: QuizData;
  results: QuizResults;
  userInfo: UserInfo;
  onRestart?: () => void;
  isSharedView?: boolean;
  interest?: InterestType | null;
  evaluationId?: string;
}

interface QuestionRecommendation {
  score: number;
  maxScore: number;
  text: string;
  selectedOption: string;
  category: string;
  recommendation: string;
}

// Determine maturity level based on quiz type and score
function getMaturityLevel(quizId: string, score: number): MaturityLevel {
  if (quizId === "evaluacion-inicial") {
    // Initial evaluation tiers
    if (score <= 9) {
      return {
        level: "Nivel 1 – Inicial / Ad-hoc",
        emoji: "🔴",
        color: "text-red-600",
        bgColor: "bg-red-100",
        description:
          "No hay un enfoque estructurado de ciberseguridad. Los controles son inexistentes o informales. Se requiere establecer procesos y medidas de seguridad básicas.",
      };
    }
    if (score <= 19) {
      return {
        level: "Nivel 2 – Repetible pero intuitivo",
        emoji: "🟠",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        description:
          "Existen algunos controles de ciberseguridad, pero no están formalizados ni aplicados de manera consistente. Aún se depende de acciones individuales y no hay gestión centralizada.",
      };
    }
    if (score <= 29) {
      return {
        level: "Nivel 3 – Definido",
        emoji: "🟡",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        description:
          "La organización cuenta con políticas y procesos documentados de ciberseguridad. Hay roles definidos, pero aún falta optimizar la aplicación y supervisión de estos controles.",
      };
    }
    if (score <= 39) {
      return {
        level: "Nivel 4 – Gestionado y Medido",
        emoji: "🟢",
        color: "text-green-600",
        bgColor: "bg-green-100",
        description:
          "La ciberseguridad se gestiona activamente con métricas, auditorías y monitoreo continuo. Se aplican mejoras constantes, pero hay oportunidades de optimización en procesos críticos.",
      };
    }
    if (score <= 44) {
      return {
        level: "Nivel 5 – Optimizado",
        emoji: "🔵",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        description:
          "La ciberseguridad está en un nivel avanzado con controles implementados y revisados periódicamente. Se han adoptado procesos de mejora continua, aunque aún pueden fortalecerse ciertos aspectos estratégicos.",
      };
    }
    return {
      level: "Nivel 5 – Óptimo",
      emoji: "🔵",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description:
        "La ciberseguridad es robusta y completamente integrada en la organización. Se han automatizado procesos, gestionado proactivamente los riesgos y optimizado los controles. Sin embargo, siempre hay margen de evolución ante nuevas amenazas.",
    };
  }

  // Advanced evaluation tiers
  if (score <= 15) {
    return {
      level: "Nivel 1 – Inicial / Ad-hoc",
      emoji: "🔴",
      color: "text-red-600",
      bgColor: "bg-red-100",
      description:
        "La seguridad se maneja de forma reactiva. No hay procesos documentados ni una estructura clara para gestionar riesgos y proteger la información.",
      advice:
        "Trabaja en establecer una estrategia inicial de seguridad, enfocada en definir políticas, roles y procesos básicos para proteger la información. ISO 27001 y NIST recomiendan empezar con la identificación de activos y riesgos.",
    };
  }
  if (score <= 34) {
    return {
      level: "Nivel 2 – Repetible pero intuitivo",
      emoji: "🟠",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description:
        "Existen controles básicos, pero su aplicación no es uniforme. La seguridad depende de esfuerzos individuales y acciones aisladas en lugar de procesos bien definidos.",
      advice:
        "Estandariza y documenta las políticas de seguridad, asegurando que sean aplicadas en toda la organización. Trabaja en la gestión de riesgos y en el uso de controles técnicos recomendados por CIS Controls y NIST CSF.",
    };
  }
  if (score <= 51) {
    return {
      level: "Nivel 3 – Definido",
      emoji: "🟡",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      description:
        "Los procesos de ciberseguridad están estructurados y alineados con estándares como ISO 27001, NIST y CIS. Se han implementado controles en la nube, gestión de vulnerabilidades y auditorías.",
      advice:
        "Profundiza en la medición y optimización de los controles, con el uso de monitoreo continuo y métricas de seguridad. Explora herramientas de Zero Trust, segmentación de red y pruebas de seguridad en aplicaciones (DevSecOps, OWASP ASVS).",
    };
  }
  if (score <= 66) {
    return {
      level: "Nivel 4 – Gestionado y Medido",
      emoji: "🟢",
      color: "text-green-600",
      bgColor: "bg-green-100",
      description:
        "La ciberseguridad es gestionada con métricas, auditorías y monitoreo activo. Se han implementado SOC, SIEM, análisis de amenazas y simulaciones de incidentes (Red Team, Blue Team).",
      advice:
        "Asegura la mejora continua en la gestión de incidentes y la resiliencia organizacional. Refuerza el uso de inteligencia de amenazas (OSINT, Dark Web Monitoring) y la automatización de respuestas a incidentes (SOAR, XDR).",
    };
  }
  if (score <= 74) {
    return {
      level: "Nivel 5 – Optimizado",
      emoji: "🔵",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description:
        "Ciberseguridad avanzada con procesos automatizados y monitoreo en tiempo real. Se han adoptado estrategias como Zero Trust, detección de amenazas con IA y seguridad en la nube con cumplimiento de marcos como AWS Well-Architected, Google Cloud Security y Azure Security Center.",
      advice:
        "Sigue fortaleciendo la estrategia de seguridad con ciberinteligencia y automatización. Evalúa constantemente nuevas tecnologías, mejora la gestión de crisis y resiliencia y optimiza los procesos de respuesta a incidentes con IA.",
    };
  }
  return {
    level: "Nivel 5 – Óptimo",
    emoji: "🔵",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description:
      "Ciberseguridad completamente integrada en la cultura organizacional. Se han implementado detección de amenazas con IA, automatización total de respuesta a incidentes, monitoreo continuo de la Dark Web y cumplimiento avanzado de seguridad en entornos híbridos y en la nube.",
    advice:
      "Se nota que has trabajado en ciberseguridad y dominas los estándares. Mantén un enfoque en innovación y evolución, asegurando que el equipo y la organización estén preparados para amenazas emergentes. Continúa reforzando la estrategia con simulaciones avanzadas y escenarios de crisis en entornos reales.",
  };
}

// Function to translate interest reason to Spanish
function getInterestReasonText(reason: InterestOption): string {
  switch (reason) {
    case "process":
      return "Estoy en un proceso de ciberseguridad en mi empresa";
    case "nothing":
      return "No tengo nada en mi empresa y quiero aumentar el nivel de madurez";
    case "curiosity":
      return "Tengo curiosidad y quiero aprender más sobre ciberseguridad";
    case "requirement":
      return "Me piden evaluar la ciberseguridad en mi organización";
    case "other":
      return "Otro motivo";
    default:
      return "No especificado";
  }
}

export function CybersecurityResults({
  quizData,
  results,
  userInfo,
  onRestart,
  isSharedView = false,
  interest,
  evaluationId,
}: CybersecurityResultsProps) {
  // Log the input data for debugging
  console.log(
    "CybersecurityResults - quizData:",
    quizData.id,
    quizData.questions.length
  );
  console.log("CybersecurityResults - results:", JSON.stringify(results));
  console.log(
    "CybersecurityResults - results count:",
    Object.keys(results).length
  );
  console.log("CybersecurityResults - interest data:", interest);

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

  // Calculate scores by category and collect recommendations
  const categoryScores: Record<string, { total: number; max: number }> = {};
  const recommendations: QuestionRecommendation[] = [];

  for (const question of quizData.questions) {
    const category = question.category || "General";
    const score = processedResults[question.id] || 0;

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

    // Store the selected option for this question
    const selectedOption = question.options.find((o) => o.value === score);

    if (!categoryScores[category]) {
      categoryScores[category] = { total: 0, max: 0 };
    }

    categoryScores[category].total += score;
    categoryScores[category].max += maxScore;

    // Add recommendation based on score
    if (selectedOption) {
      const percentage = (score / maxScore) * 100;
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
        score,
        maxScore,
        text: question.text,
        selectedOption:
          selectedOption.text || selectedOption.label || `Opción ${score}`,
        category,
        recommendation,
      });
    }

    // Log each question's score for debugging
    console.log(
      `Question ${question.id} (${category}): score=${score}, maxScore=${maxScore}`
    );
  }

  // Calculate overall score
  const overallScore = Object.values(categoryScores).reduce(
    (sum, { total }) => sum + total,
    0
  );
  const maxPossibleScore = Object.values(categoryScores).reduce(
    (sum, { max }) => sum + max,
    0
  );

  // Get maturity level based on quiz type and score
  const maturity = getMaturityLevel(quizData.id, overallScore);

  // Get category-specific maturity levels
  const categoryMaturityLevels = Object.entries(categoryScores).map(
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

  // Extract categories for specialist recommendations - get the lowest scoring categories
  const categoryScoresForSpecialists = Object.entries(categoryScores).map(
    ([category, { total, max }]) => ({
      category,
      percentage: Math.round((total / max) * 100),
    })
  );

  // Get the two lowest scoring categories (areas that need the most help)
  const weakestCategories = [...categoryScoresForSpecialists]
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 2)
    .map((item) => item.category);

  // Inside the CybersecurityResults component
  // Need to extract the maturity level number (1-5) from maturity.level string
  const maturityLevelNumber = parseInt(
    maturity.level.split("–")[0].replace("Nivel ", "").trim(),
    10
  );

  // Create the URL for the scheduling page with evaluation data
  const scheduleUrl = `/schedule?level=${maturityLevelNumber}&categories=${weakestCategories.join(",")}${evaluationId ? `&evaluationId=${evaluationId}` : ""}`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="p-8 bg-white border-b shadow-sm">
        <SimpleHeader className="text-primary" />
      </header>

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
                {userInfo.firstName}, aquí están sus resultados
              </h1>
              <p className="text-lg text-gray-600">
                Evaluación de Madurez en Ciberseguridad
              </p>
            </div>

            {interest && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-medium text-gray-800 mb-2">
                  Tu interés en ciberseguridad:
                </h3>
                <p className="text-gray-700">
                  {getInterestReasonText(interest.reason as InterestOption)}
                  {interest.reason === "other" && interest.otherReason && (
                    <span className="block mt-1 italic">
                      &ldquo;{interest.otherReason}&rdquo;
                    </span>
                  )}
                </p>
              </div>
            )}

            <div className={cn("p-6 rounded-lg shadow-sm", "bg-white")}>
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Resumen General
              </h2>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="bg-white p-4 rounded-lg flex-1 shadow-sm border">
                  <p className="text-sm text-gray-600 mb-1">Puntuación Total</p>
                  <p className={`text-3xl font-bold ${maturity.color}`}>
                    {overallScore}/{maxPossibleScore}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg flex-1 shadow-sm border">
                  <p className="text-sm text-gray-600 mb-1">Nivel de Madurez</p>
                  <p
                    className={`text-3xl font-bold ${maturity.color} flex items-center gap-2`}
                  >
                    <span>{maturity.emoji}</span>
                    <span>{maturity.level}</span>
                  </p>
                </div>
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span
                      className={`${maturity.color} font-semibold inline-block py-1 px-2 uppercase rounded-full text-xs`}
                    >
                      PROGRESO
                    </span>
                  </div>
                  <div className={`${maturity.color} text-right`}>
                    <span className="text-xs font-semibold inline-block">
                      {Math.round((overallScore / maxPossibleScore) * 100)}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={Math.round((overallScore / maxPossibleScore) * 100)}
                  className={cn(
                    "h-2.5",
                    maturity.color === "text-red-600" &&
                      "bg-red-100 [&>div]:bg-red-600",
                    maturity.color === "text-orange-600" &&
                      "bg-orange-100 [&>div]:bg-orange-600",
                    maturity.color === "text-yellow-600" &&
                      "bg-yellow-100 [&>div]:bg-yellow-600",
                    maturity.color === "text-green-600" &&
                      "bg-green-100 [&>div]:bg-green-600",
                    maturity.color === "text-blue-600" &&
                      "bg-blue-100 [&>div]:bg-blue-600"
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
                  maturity.color.replace("text", "border")
                )}
              >
                <p className={`${maturity.color} font-medium mb-4`}>
                  {maturity.description}
                </p>
                {maturity.advice && (
                  <>
                    <h3 className={`font-semibold mt-4 mb-2 ${maturity.color}`}>
                      Recomendación General
                    </h3>
                    <p className={`${maturity.color}`}>{maturity.advice}</p>
                  </>
                )}
              </div>

              {/* Call to Action Banner */}
              <div
                className={cn(
                  "mt-6 p-6 rounded-xl text-white shadow-lg border transform hover:scale-[1.02] transition-all duration-300",
                  maturity.color === "text-red-600" &&
                    "bg-gradient-to-r from-red-500 to-red-600 border-red-300",
                  maturity.color === "text-orange-600" &&
                    "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-300",
                  maturity.color === "text-yellow-600" &&
                    "bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-300",
                  maturity.color === "text-green-600" &&
                    "bg-gradient-to-r from-green-500 to-green-600 border-green-300",
                  maturity.color === "text-blue-600" &&
                    "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-300"
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
                      medidas necesarias para proteger tu organización de
                      amenazas cibernéticas.
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
                    <Link href={scheduleUrl} className="inline-block">
                      <Button
                        className={cn(
                          "bg-white px-6 py-6 shadow-md font-bold rounded-full flex gap-2 items-center",
                          maturity.color === "text-red-600" &&
                            "text-red-600 hover:bg-red-50",
                          maturity.color === "text-orange-600" &&
                            "text-orange-600 hover:bg-orange-50",
                          maturity.color === "text-yellow-600" &&
                            "text-yellow-600 hover:bg-yellow-50",
                          maturity.color === "text-green-600" &&
                            "text-green-600 hover:bg-green-50",
                          maturity.color === "text-blue-600" &&
                            "text-blue-600 hover:bg-blue-50"
                        )}
                      >
                        Agendar Especialista
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
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Desglose por Categoría
              </h2>
              <div className="space-y-4">
                {categoryMaturityLevels.map(({ category, total, max }) => {
                  const percentage = Math.round((total / max) * 100);
                  return (
                    <div
                      key={category}
                      className={cn(
                        "border rounded-lg overflow-hidden",
                        maturity.color.replace("text", "border")
                      )}
                    >
                      <div className="bg-white p-4">
                        <div className="flex justify-between mb-2">
                          <span className={`font-medium ${maturity.color}`}>
                            {category}
                          </span>
                          <span className={`${maturity.color} font-medium`}>
                            {total}/{max} ({percentage}%)
                          </span>
                        </div>
                        <Progress
                          value={percentage}
                          className={cn(
                            "h-2.5",
                            maturity.color === "text-red-600" &&
                              "bg-red-100 [&>div]:bg-red-600",
                            maturity.color === "text-orange-600" &&
                              "bg-orange-100 [&>div]:bg-orange-600",
                            maturity.color === "text-yellow-600" &&
                              "bg-yellow-100 [&>div]:bg-yellow-600",
                            maturity.color === "text-green-600" &&
                              "bg-green-100 [&>div]:bg-green-600",
                            maturity.color === "text-blue-600" &&
                              "bg-blue-100 [&>div]:bg-blue-600"
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Recomendaciones Específicas
              </h2>
              <div className="space-y-4">
                {recommendations.map((rec) => {
                  const percentage = Math.round(
                    (rec.score / rec.maxScore) * 100
                  );
                  return (
                    <div
                      key={rec.text}
                      className={cn(
                        "border rounded-lg overflow-hidden",
                        maturity.color.replace("text", "border")
                      )}
                    >
                      <div className="bg-white p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3
                            className={`font-medium flex-grow ${maturity.color}`}
                          >
                            {rec.text}
                          </h3>
                          <span
                            className={`${maturity.color} font-medium ml-4 whitespace-nowrap`}
                          >
                            {rec.score}/{rec.maxScore}
                          </span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded mb-3">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">
                              Respuesta seleccionada:
                            </span>{" "}
                            {rec.selectedOption}
                          </p>
                        </div>
                        <div className="mb-3">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span
                                className={`${maturity.color} text-xs font-semibold`}
                              >
                                Puntuación
                              </span>
                            </div>
                            <div className={`${maturity.color} text-right`}>
                              <span className="text-xs font-semibold">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                          <Progress
                            value={percentage}
                            className={cn(
                              "h-2.5",
                              maturity.color === "text-red-600" &&
                                "bg-red-100 [&>div]:bg-red-600",
                              maturity.color === "text-orange-600" &&
                                "bg-orange-100 [&>div]:bg-orange-600",
                              maturity.color === "text-yellow-600" &&
                                "bg-yellow-100 [&>div]:bg-yellow-600",
                              maturity.color === "text-green-600" &&
                                "bg-green-100 [&>div]:bg-green-600",
                              maturity.color === "text-blue-600" &&
                                "bg-blue-100 [&>div]:bg-blue-600"
                            )}
                          />
                        </div>
                        <p
                          className={`text-sm font-medium ${maturity.color} mt-2`}
                        >
                          <span className="font-bold">Recomendación:</span>{" "}
                          {rec.recommendation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <SpecialistsRecommendations
                maturityLevel={maturityLevelNumber}
                categories={weakestCategories}
              />
            </div>

            {!isSharedView && onRestart && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={onRestart}
                  className={`${maturity.color.replace("text", "bg")} text-white hover:opacity-90 rounded-full px-8 py-6`}
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
