"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { QuizQuestion as QuizQuestionType } from "./types";
import { useRef } from "react";
import { SimpleHeader } from "@/components/ui/simple-header";
import { Button } from "@/components/ui/button";

interface QuizQuestionProps {
  question: QuizQuestionType;
  currentIndex: number;
  totalQuestions: number;
  selectedValue: number | null;
  onSelect: (value: number) => void;
  onNext: () => void;
  onPrev: () => void;
  showPrev?: boolean;
}

export function QuizQuestion({
  question,
  currentIndex,
  totalQuestions,
  selectedValue,
  onSelect,
  onNext,
  onPrev,
  showPrev = true,
}: QuizQuestionProps) {
  const questionRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with logo */}
      <header className="p-4 md:p-8 bg-background border-b">
        <div className="h-8">
          <SimpleHeader className="text-primary" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              ref={questionRef}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="w-full px-4 md:px-0"
            >
              <div className="mb-4 text-sm md:text-base">
                {currentIndex + 1} / {totalQuestions}
              </div>

              <h2 className="text-xl md:text-2xl font-medium mb-8">
                {question.text}
              </h2>

              <div className="mb-8">
                <div className="flex justify-between items-center relative mb-4">
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-300" />
                  {question.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex flex-col items-center z-10"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelect(option.value);
                          setTimeout(() => onNext(), 300);
                        }}
                        className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-gray-300 flex items-center justify-center ${
                          selectedValue === option.value
                            ? "bg-black border-black"
                            : "bg-white"
                        }`}
                        aria-label={option.label}
                      >
                        {selectedValue === option.value && (
                          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  {question.options.map((option) => (
                    <div
                      key={option.value}
                      className="w-1/5 text-center text-xs md:text-sm"
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Navigation buttons - Hidden on mobile, shown on desktop */}
      <div className="hidden md:flex fixed right-8 top-1/2 transform -translate-y-1/2 flex-col space-y-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0}
          className={`p-2 rounded-full border-2 ${
            currentIndex === 0
              ? "border-muted text-muted"
              : "border-primary text-primary hover:bg-secondary"
          }`}
          aria-label="Pregunta anterior"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={selectedValue === null}
          className={`p-2 rounded-full border-2 ${
            selectedValue === null
              ? "border-muted text-muted"
              : "border-primary text-primary hover:bg-secondary"
          }`}
          aria-label="Siguiente pregunta"
        >
          ↓
        </button>
      </div>

      {/* Mobile navigation buttons */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 flex justify-between p-4 bg-white border-t">
        <Button
          onClick={onPrev}
          disabled={!showPrev}
          variant="outline"
          className="w-[45%]"
        >
          Anterior
        </Button>
        <Button
          onClick={onNext}
          disabled={selectedValue === null}
          variant="outline"
          className="w-[45%]"
        >
          Siguiente
        </Button>
      </div>

      {/* Progress bar */}
      <footer className="p-4 mb-16 md:mb-0">
        <div className="flex items-center justify-center">
          <div className="w-full md:w-1/3 bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gray-400 h-full rounded-full"
              style={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
