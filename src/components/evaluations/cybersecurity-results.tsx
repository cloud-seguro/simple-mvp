"use client";

import { Progress } from "@/components/ui/progress";
import type {
  QuizData,
  QuizResults,
  Category,
  CybersecurityResultsProps,
  QuizQuestion,
  QuizOption,
} from "./types";
import { SimpleHeader } from "@/components/ui/simple-header";

interface MaturityLevel {
  level: string;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
  advice?: string;
}

// Determine maturity level based on quiz type and score
export function getMaturityLevel(quizId: string, score: number): MaturityLevel {
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

export function CybersecurityResults({
  quizData,
  results,
  onRestart,
  isSharedView = false,
  interest,
  maturityDescription,
  categories,
}: Omit<CybersecurityResultsProps, "userInfo">) {
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
    (question: QuizQuestion) => mappedResults[question.id] === undefined
  );

  if (missingQuestions.length > 0) {
    console.log(
      "CybersecurityResults - Missing questions:",
      missingQuestions.map((q: QuizQuestion) => q.id)
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

  for (const question of quizData.questions) {
    const category = question.category || "General";
    const score = processedResults[question.id] || 0;

    // Log if the question ID is not found in results
    if (processedResults[question.id] === undefined) {
      console.warn(`Question ID ${question.id} not found in results`);
    }

    const maxScore = Math.max(
      ...question.options.map((o: QuizOption) => {
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

    categoryScores[category].total += score;
    categoryScores[category].max += maxScore;

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

  // Get maturity level based on quiz type and score
  const maturity = getMaturityLevel(quizData.id, overallScore);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isSharedView && <SimpleHeader />}
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Resultados de Evaluación
              </h1>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{maturity.emoji}</span>
                <span className={`text-xl font-semibold ${maturity.color}`}>
                  {maturity.level}
                </span>
              </div>
              <p className="text-gray-600">{maturityDescription}</p>
              {maturity.advice && (
                <p className={`mt-2 ${maturity.color}`}>{maturity.advice}</p>
              )}
            </div>
            <div className="space-y-6">
              {categories.map((category: Category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-gray-500">
                      {category.score}/{category.maxScore}
                    </span>
                  </div>
                  <Progress
                    value={(category.score / category.maxScore) * 100}
                  />
                </div>
              ))}
            </div>
            {!isSharedView && onRestart && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={onRestart}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
                >
                  Realizar otra evaluación
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
