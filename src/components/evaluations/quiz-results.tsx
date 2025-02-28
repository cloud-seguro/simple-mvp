"use client"

import { Button } from "@/components/ui/button"
import type { QuizData, QuizResults as QuizResultsType } from "./types"

interface QuizResultsProps {
  quizData: QuizData
  results: QuizResultsType
  onRestart: () => void
}

export function QuizResults({ quizData, results, onRestart }: QuizResultsProps) {
  // Calculate scores by category
  const categoryScores: Record<string, { total: number; max: number }> = {}

  for (const question of quizData.questions) {
    const category = question.category || "General"
    const score = results[question.id] || 0
    const maxScore = Math.max(...question.options.map((o) => o.value))

    if (!categoryScores[category]) {
      categoryScores[category] = { total: 0, max: 0 }
    }

    categoryScores[category].total += score
    categoryScores[category].max += maxScore
  }

  // Calculate overall score
  const overallScore = Object.values(categoryScores).reduce((sum, { total }) => sum + total, 0)

  const maxPossibleScore = Object.values(categoryScores).reduce((sum, { max }) => sum + max, 0)

  const overallPercentage = Math.round((overallScore / maxPossibleScore) * 100)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-8 bg-[#FF8548]">
        <h1 className="text-2xl font-bold text-white">SIMPLE</h1>
      </header>

      <main className="flex-grow p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{quizData.title} Results</h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              Overall Score: {overallScore}/{maxPossibleScore} ({overallPercentage}%)
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
              <div className="bg-[#FF8548] h-4 rounded-full" style={{ width: `${overallPercentage}%` }} />
            </div>

            <h3 className="text-lg font-medium mb-4">Category Breakdown:</h3>
            <div className="space-y-4">
              {Object.entries(categoryScores).map(([category, { total, max }]) => {
                const percentage = Math.round((total / max) * 100)
                return (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{category}</span>
                      <span>
                        {total}/{max} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#FF8548] h-2 rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Button onClick={onRestart} className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-2">
            Take Another Assessment
          </Button>
        </div>
      </main>

      <footer className="p-4 border-t">{/* Terms and privacy links removed */}</footer>
    </div>
  )
}

