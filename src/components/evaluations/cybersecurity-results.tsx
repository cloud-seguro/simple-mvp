"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { QuizData, QuizResults, UserInfo } from "./types";
import { SimpleHeader } from "@/components/ui/simple-header"

interface CybersecurityResultsProps {
  quizData: QuizData;
  results: QuizResults;
  userInfo: UserInfo;
  onRestart?: () => void;
  isSharedView?: boolean;
}

export function CybersecurityResults({
  quizData,
  results,
  userInfo,
  onRestart,
  isSharedView = false,
}: CybersecurityResultsProps) {
  // Log the input data for debugging
  console.log(
    "CybersecurityResults - quizData:",
    quizData.id,
    quizData.questions.length
  );
  console.log("CybersecurityResults - results:", JSON.stringify(results));

  // Calculate scores by category
  const categoryScores: Record<string, { total: number; max: number }> = {};

  for (const question of quizData.questions) {
    const category = question.category || "General";
    const score = results[question.id] || 0;

    // Handle both text and label properties for backward compatibility
    // Make sure we're getting the maximum value correctly from the options
    const maxScore = Math.max(...question.options.map((o) => o.value));

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
  const maxPossibleScore = Object.values(categoryScores).reduce(
    (sum, { max }) => sum + max,
    0
  );

  // Log the calculated scores for debugging
  console.log("Category scores:", JSON.stringify(categoryScores));
  console.log(`Overall score: ${overallScore}/${maxPossibleScore}`);

  // Determine maturity level
  const getMaturityLevel = (score: number) => {
    if (score <= 24) return { level: "Bajo", color: "text-red-600" };
    if (score <= 48) return { level: "Medio", color: "text-yellow-600" };
    return { level: "Alto", color: "text-green-600" };
  };

  const maturity = getMaturityLevel(overallScore);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-8 bg-background border-b">
        <SimpleHeader className="text-primary" />
      </header>

      <main className="flex-grow p-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {userInfo.firstName}, aquí están sus resultados
              </h1>
              <p className="text-lg text-gray-600">
                Evaluación de Madurez en Ciberseguridad
              </p>
            </div>

            <div className="bg-secondary p-6 rounded-md">
              <h2 className="text-xl font-semibold mb-4">Resumen General</h2>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Puntuación Total</p>
                  <p className="text-3xl font-bold">
                    {overallScore}/{maxPossibleScore}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nivel de Madurez</p>
                  <p className={`text-3xl font-bold ${maturity.color}`}>
                    {maturity.level}
                  </p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-4">
                <div
                  className="bg-primary h-4 rounded-full transition-all duration-1000"
                  style={{
                    width: `${(overallScore / maxPossibleScore) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-secondary p-6 rounded-md">
              <h2 className="text-xl font-semibold mb-4">
                Desglose por Categoría
              </h2>
              <div className="space-y-6">
                {Object.entries(categoryScores).map(
                  ([category, { total, max }]) => {
                    const percentage = (total / max) * 100;
                    return (
                      <div key={category}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{category}</span>
                          <span>
                            {total}/{max} ({Math.round(percentage)}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <div className="bg-secondary p-6 rounded-md">
              <h2 className="text-xl font-semibold mb-4">Recomendaciones</h2>
              <div className="space-y-4">
                {Object.entries(categoryScores).map(
                  ([category, { total, max }]) => {
                    const percentage = (total / max) * 100;
                    let recommendation = "";

                    if (percentage < 33) {
                      recommendation =
                        "Necesita atención inmediata. Considere implementar controles básicos y establecer políticas fundamentales.";
                    } else if (percentage < 66) {
                      recommendation =
                        "Hay margen de mejora. Refuerce las políticas existentes y considere implementar controles más avanzados.";
                    } else {
                      recommendation =
                        "Buen nivel de madurez. Mantenga las prácticas actuales y considere mejoras continuas.";
                    }

                    return (
                      <div key={category}>
                        <h3 className="font-medium">{category}</h3>
                        <p className="text-gray-600">{recommendation}</p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {!isSharedView && onRestart && (
              <Button
                onClick={onRestart}
                className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-2"
              >
                Realizar otra evaluación
              </Button>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

