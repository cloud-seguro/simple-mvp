"use client";

import { useState } from "react";
import { SignUpForm } from "@/components/auth/sign-up/components/sign-up-form";
import { SignInForm } from "@/components/auth/sign-in/components/sign-in-form";
import { motion } from "framer-motion";
import type { QuizResults, CybersecurityInterest } from "./types";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";

interface EvaluationSignUpProps {
  results: QuizResults;
  quizId: string;
  onComplete: (evaluationId?: string) => void;
  interest?: CybersecurityInterest | null;
}

type AuthMode = "signup" | "signin";

export function EvaluationSignUp({
  results,
  quizId,
  onComplete,
  interest,
}: EvaluationSignUpProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  // This function will be called after successful sign-up or sign-in
  const handleAuthComplete = async (userId: string) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setLoadingMessage("Preparando para guardar resultados...");

      // Try to fetch the profile directly to ensure it's available
      try {
        setLoadingMessage("Verificando perfil...");
        // Add a delay to ensure the profile has been created
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Try to fetch the profile
        const profileResponse = await fetch(`/api/profile/${userId}`);
        if (!profileResponse.ok) {
          console.log(
            `Profile not found for user ${userId}, might still be creating...`
          );
        } else {
          console.log(`Profile successfully fetched for user ${userId}`);
        }
      } catch (profileError) {
        console.error("Error checking profile:", profileError);
        // Continue anyway, as this is just a verification step
      }

      // Add a longer delay to ensure the user session and profile are properly set
      // This is especially important after sign-up
      setLoadingMessage("Preparando datos de evaluación...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setLoadingMessage("Guardando resultados de evaluación...");

      // Determine evaluation type based on quiz ID
      const evaluationType =
        quizId === "evaluacion-inicial" ? "INITIAL" : "ADVANCED";

      // For advanced evaluations, create default interest data if none provided
      let finalInterestData = interest;
      if (evaluationType === "ADVANCED" && !finalInterestData) {
        finalInterestData = {
          reason: "advanced",
          otherReason: "Evaluación avanzada de ciberseguridad",
        };
      }

      // Retry logic for saving evaluation results
      let success = false;
      let retryCount = 0;
      const maxRetries = 5;
      let lastError = null;
      let savedEvaluationId = null;

      while (!success && retryCount < maxRetries) {
        try {
          setLoadingMessage(
            `Guardando resultados (intento ${retryCount + 1}/${maxRetries})...`
          );

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
              interest: finalInterestData,
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

          const data = await response.json();
          savedEvaluationId = data.evaluation.id;
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
            // Exponential backoff for retries
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * 1.5 ** retryCount)
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

      // Set as completed
      setLoadingMessage("¡Listo! Preparando resultados...");

      // Add a small delay before proceeding
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Proceed to the next step with the evaluation ID
      onComplete(savedEvaluationId || undefined);

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

      // Still try to proceed to avoid getting stuck
      setLoadingMessage("Continuando a pesar del error...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onComplete();
    } finally {
      setIsSubmitting(false);
      setLoadingMessage("");
    }
  };

  // Custom handlers for sign-up and sign-in forms to track process state
  const handleSignUpStart = () => {
    setLoadingMessage("Creando cuenta...");
  };

  const handleSignInStart = () => {
    setLoadingMessage("Iniciando sesión...");
  };

  const handleProfileCreationStart = () => {
    setLoadingMessage("Creando perfil...");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6"
    >
      {isSubmitting && (
        <SecurityLoadingScreen
          variant="overlay"
          message={loadingMessage || "Procesando..."}
        />
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
            onSignUpStart={handleSignUpStart}
            onProfileCreationStart={handleProfileCreationStart}
            evaluationResults={{
              quizId,
              results,
            }}
          />
        ) : (
          <SignInForm
            className="w-full"
            onSignInComplete={handleAuthComplete}
            onSignInStart={handleSignInStart}
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
