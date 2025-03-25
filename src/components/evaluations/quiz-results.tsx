"use client";

import { Button } from "@/components/ui/button";
import type { QuizData, QuizResults as QuizResultsType } from "./types";
import Link from "next/link";
import { SpecialistsRecommendations } from "./specialists-recommendations";

interface QuizResultsProps {
  quizData: QuizData;
  results: QuizResultsType;
  onRestart: () => void;
}

const getMaturityLevelInfo = (percentage: number) => {
  if (percentage < 10) {
    return {
      level: 1,
      title: "Nivel 1 - Inicial / Ad-hoc",
      description:
        "No hay un enfoque estructurado de ciberseguridad. Los controles son inexistentes o informales. Se requiere establecer procesos y medidas de seguridad básicas.",
      recommendation:
        "Te podemos apoyar en subir este nivel de madurez hacerlo solo toma más tiempo.",
      actionText: "Comenzar Evaluación",
    };
  } else if (percentage < 20) {
    return {
      level: 2,
      title: "Nivel 2 - Repetible pero intuitivo",
      description:
        "Existen algunos controles de ciberseguridad, pero no están formalizados ni aplicados de manera consistente. Aún se depende de acciones individuales y no hay gestión centralizada.",
      recommendation:
        "Para validar tu estado de seguridad, Ciberseguridad Simple puede realizar una auditoría y verificación de documentación, controles y riesgos.",
      actionText: "Solicitar Auditoría",
    };
  } else if (percentage < 30) {
    return {
      level: 3,
      title: "Nivel 3 - Definido",
      description:
        "La organización cuenta con políticas y procesos documentados de ciberseguridad. Hay roles definidos, pero aún falta optimizar la aplicación y supervisión de estos controles.",
      recommendation:
        "Se recomienda una verificación con Ciberseguridad Simple para revisar documentación, procesos y riesgos clave.",
      actionText: "Verificar Procesos",
    };
  } else if (percentage < 40) {
    return {
      level: 4,
      title: "Nivel 4 - Gestionado y Medido",
      description:
        "La ciberseguridad se gestiona activamente con métricas, auditorías y monitoreo continuo. Se aplican mejoras constantes, pero hay oportunidades de optimización en procesos críticos.",
      recommendation:
        "Se recomienda una verificación con Ciberseguridad Simple para revisar documentación, procesos y riesgos clave.",
      actionText: "Optimizar Gestión",
    };
  } else if (percentage < 45) {
    return {
      level: 5,
      title: "Nivel 5 - Optimizado",
      description:
        "La ciberseguridad está en un nivel avanzado con controles implementados y revisados periódicamente. Se han adoptado procesos de mejora continua, aunque aún pueden fortalecerse ciertos aspectos estratégicos.",
      recommendation:
        "Se recomienda una verificación con Ciberseguridad Simple para evaluar la efectividad de los controles, revisar la documentación de seguridad y validar la gestión de riesgos.",
      actionText: "Evaluar Efectividad",
    };
  } else {
    return {
      level: 5,
      title: "Nivel 5 - Óptimo",
      description:
        "La ciberseguridad es robusta y completamente integrada en la organización. Se han automatizado procesos, gestionado proactivamente los riesgos y optimizado los controles. Sin embargo, siempre hay margen de evolución ante nuevas amenazas.",
      recommendation:
        "Para validar tu estado de seguridad, Ciberseguridad Simple puede realizar una auditoría y verificación de documentación, controles y riesgos.",
      actionText: "Mantener Excelencia",
    };
  }
};

export function QuizResults({
  quizData,
  results,
  onRestart,
}: QuizResultsProps) {
  // Calculate scores by category
  const categoryScores: Record<string, { total: number; max: number }> = {};

  for (const question of quizData.questions) {
    const category = question.category || "General";
    const score = results[question.id] || 0;
    const maxScore = Math.max(...question.options.map((o) => o.value));

    if (!categoryScores[category]) {
      categoryScores[category] = { total: 0, max: 0 };
    }

    categoryScores[category].total += score;
    categoryScores[category].max += maxScore;
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

  const overallPercentage = Math.round((overallScore / maxPossibleScore) * 100);
  const maturityInfo = getMaturityLevelInfo(overallPercentage);

  // Get top categories (for specialists recommendations)
  const categoryPercentages = Object.entries(categoryScores).map(
    ([category, { total, max }]) => ({
      category,
      percentage: Math.round((total / max) * 100),
    })
  );

  // Get the two lowest scoring categories (areas that need the most help)
  const weakestCategories = [...categoryPercentages]
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 2)
    .map((item) => item.category);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-8 bg-[#FF8548]">
        <h1 className="text-2xl font-bold text-white">SIMPLE</h1>
      </header>

      <main className="flex-grow p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Resultados de {quizData.title}
          </h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              Puntuación Total: {overallScore}/{maxPossibleScore} (
              {overallPercentage}%)
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
              <div
                className="bg-[#FF8548] h-4 rounded-full"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>

            {/* Maturity Level Information */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
              <h3 className="text-xl font-bold mb-2 text-[#FF8548]">
                {maturityInfo.title}
              </h3>
              <p className="text-gray-600 mb-4">{maturityInfo.description}</p>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold mb-2">Recomendación:</h4>
                <p className="text-gray-700 mb-4">
                  {maturityInfo.recommendation}
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-[#FF8548] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#e67a41] transition-colors"
                >
                  {maturityInfo.actionText}
                </Link>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-4">
              Desglose por Categoría:
            </h3>
            <div className="space-y-4 mb-8">
              {Object.entries(categoryScores).map(
                ([category, { total, max }]) => {
                  const percentage = Math.round((total / max) * 100);
                  return (
                    <div key={category}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{category}</span>
                        <span>
                          {total}/{max} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#FF8548] h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* Specialists Recommendations */}
            <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <SpecialistsRecommendations
                maturityLevel={maturityInfo.level}
                categories={weakestCategories}
              />
            </div>
          </div>

          <Button
            onClick={onRestart}
            className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-2 mt-8"
          >
            Realizar otra evaluación
          </Button>
        </div>
      </main>

      <footer className="p-4 border-t">
        {/* Terms and privacy links removed */}
      </footer>
    </div>
  );
}
