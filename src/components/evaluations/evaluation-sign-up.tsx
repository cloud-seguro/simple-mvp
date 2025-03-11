"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUpForm } from "@/components/auth/sign-up/components/sign-up-form";
import { SignInForm } from "@/components/auth/sign-in/components/sign-in-form";
import { motion } from "framer-motion";
import type { QuizResults } from "./types";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface EvaluationSignUpProps {
  results: QuizResults;
  quizId: string;
  onComplete: () => void;
}

type AuthMode = "signup" | "signin";

export function EvaluationSignUp({
  results,
  quizId,
  onComplete,
}: EvaluationSignUpProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const router = useRouter();

  // This function will be called after successful sign-up or sign-in
  const handleAuthComplete = async (userId: string) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setLoadingMessage("Guardando resultados de evaluación...");

      // Determine evaluation type based on quiz ID
      const evaluationType =
        quizId === "evaluacion-inicial" ? "INITIAL" : "ADVANCED";

      // Add a longer delay to ensure the user session and profile are properly set
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Retry logic for saving evaluation results
      let success = false;
      let retryCount = 0;
      const maxRetries = 3;
      let lastError = null;

      while (!success && retryCount < maxRetries) {
        try {
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
              userId, // Include userId in the request
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message ||
                "Error al guardar los resultados de la evaluación"
            );
          }

          // Wait for the response data
          const data = await response.json();
          success = true;
        } catch (error) {
          console.error(`Attempt ${retryCount + 1} failed:`, error);
          lastError = error;
          retryCount++;

          if (retryCount < maxRetries) {
            // Wait before retrying (increasing delay with each retry)
            setLoadingMessage(
              `Reintentando guardar resultados (${retryCount}/${maxRetries})...`
            );
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * retryCount)
            );
          }
        }
      }

      if (!success) {
        throw (
          lastError ||
          new Error("Failed to save evaluation results after multiple attempts")
        );
      }

      // Add a small delay before proceeding
      await new Promise((resolve) => setTimeout(resolve, 500));

      setLoadingMessage("¡Listo! Preparando resultados...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Proceed to the next step
      onComplete();

      toast({
        title: "Éxito",
        description: "Los resultados se han guardado correctamente.",
      });
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
      // Re-throw the error so the form component can handle it
      throw error;
    } finally {
      setLoadingMessage("");
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6"
    >
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin" />
              <p className="text-lg font-medium">
                {loadingMessage || "Procesando..."}
              </p>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4">¡Felicitaciones!</h1>
      <p className="mb-6">
        Ha completado la evaluación. Para ver sus resultados, cree una cuenta o
        inicie sesión.
      </p>

      <div className="flex justify-center gap-4 mb-6">
        <Button
          variant={authMode === "signup" ? "default" : "outline"}
          onClick={() => setAuthMode("signup")}
          className="flex-1"
          disabled={isSubmitting}
        >
          Crear Cuenta
        </Button>
        <Button
          variant={authMode === "signin" ? "default" : "outline"}
          onClick={() => setAuthMode("signin")}
          className="flex-1"
          disabled={isSubmitting}
        >
          Iniciar Sesión
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {authMode === "signup" ? (
          <SignUpForm
            className="w-full"
            onSignUpComplete={handleAuthComplete}
            evaluationResults={{
              quizId,
              results,
            }}
          />
        ) : (
          <SignInForm
            className="w-full"
            onSignInComplete={handleAuthComplete}
            evaluationResults={{
              quizId,
              results,
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
