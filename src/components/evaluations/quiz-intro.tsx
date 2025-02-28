"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import type { QuizData } from "../types"

interface QuizIntroProps {
  quizData: QuizData
  onStart: () => void
}

export function QuizIntro({ quizData, onStart }: QuizIntroProps) {
  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Left sidebar with logo and illustration */}
      <div className="bg-[#FFD700] w-full md:w-2/5 p-8 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">SIMPLE</h1>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <Image
            src="/illustration.svg"
            alt="Assessment illustration"
            width={300}
            height={300}
            className="max-w-[250px] w-full h-auto"
          />
        </div>
        <div className="mt-auto">{/* Terms and privacy links removed */}</div>
      </div>

      {/* Right content area */}
      <div className="w-full md:w-3/5 p-8 md:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4">{quizData.title}</h1>
          <h2 className="text-2xl font-bold mb-6">Instructions</h2>
          <p className="mb-8 text-lg">{quizData.instructions}</p>
          <Button onClick={onStart} className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-2">
            Start
          </Button>
        </div>
      </div>
    </div>
  )
}

