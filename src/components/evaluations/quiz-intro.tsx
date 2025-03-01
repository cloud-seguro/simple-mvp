"use client"

import { Button } from "@/components/ui/button"
import type { QuizData } from "./types";
import { AnimatedSecuritySVG } from "@/components/ui/animated-security-svg";
import { SimpleHeader } from "@/components/ui/simple-header"

interface QuizIntroProps {
  quizData: QuizData
  onStart: () => void
}

export function QuizIntro({ quizData, onStart }: QuizIntroProps) {
  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Left sidebar */}
      <div className="bg-[#FFD700] w-full md:w-2/5 p-4 md:p-8 flex flex-col">
        <div className="mb-4 md:mb-8">
          <SimpleHeader />
        </div>
        <div className="flex-grow flex items-center justify-center py-8 md:py-0">
          <AnimatedSecuritySVG />
        </div>
      </div>

      {/* Right content */}
      <div className="w-full md:w-3/5 p-4 md:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold">{quizData.title}</h1>
          <h2 className="text-xl md:text-2xl font-bold">Instrucciones</h2>
          <p className="text-base md:text-lg">{quizData.instructions}</p>
          <Button
            onClick={onStart}
            className="w-full md:w-auto bg-black text-white hover:bg-gray-800 rounded-full px-8 py-2"
          >
            Comenzar
          </Button>
        </div>
      </div>
    </div>
  );
}

