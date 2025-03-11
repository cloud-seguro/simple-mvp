"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUpForm } from "@/components/auth/sign-up/components/sign-up-form";
import { motion } from "framer-motion";
import type { QuizResults } from "./types";
import { toast } from "@/components/ui/use-toast";

interface EvaluationSignUpProps {
  results: QuizResults;
  quizId: string;
  onComplete: () => void;
}

export function EvaluationSignUp({
  results,
  quizId,
  onComplete,
}: EvaluationSignUpProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // This function will be called after successful sign-up
  const handleSignUpComplete = async (userId: string) => {
    try {
      setIsSubmitting(true);

      // Determine evaluation type based on quiz ID
      const evaluationType =
        quizId === "evaluacion-inicial" ? "INITIAL" : "ADVANCED";

      // Store evaluation results in the database
      const response = await fetch("/api/evaluations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: evaluationType,
          title:
            evaluationType === "INITIAL"
              ? "Evaluación Inicial"
              : "Evaluación Avanzada",
          answers: results,
          // We don't calculate the score here, it will be calculated on the server
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Error al guardar los resultados de la evaluación"
        );
      }

      // Proceed to the next step
      onComplete();
    } catch (error) {
      console.error("Error saving evaluation:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al guardar los resultados de la evaluación",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-4">¡Felicitaciones!</h1>
      <p className="mb-6">
        Ha completado la evaluación. Para ver sus resultados, cree una cuenta o
        inicie sesión.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <SignUpForm
          className="w-full"
          onSignUpComplete={handleSignUpComplete}
          evaluationResults={{
            quizId,
            results,
          }}
        />
      </div>
    </motion.div>
  );
}
