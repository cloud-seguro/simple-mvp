"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Copy, Mail } from "lucide-react";
import type { UserInfo } from "./types";
import { AnimatedSecuritySVG } from "@/components/ui/animated-security-svg";
import { SimpleHeader } from "@/components/ui/simple-header";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState, useRef } from "react";

interface ResultsReadyProps {
  userInfo: UserInfo;
  onViewResults: () => void;
  shareUrl?: string;
  evaluationId?: string;
}

export function ResultsReady({
  userInfo,
  onViewResults,
  shareUrl,
  evaluationId,
}: ResultsReadyProps) {
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hasInitiatedSendRef = useRef(false);

  useEffect(() => {
    // Use this function to ensure we only send once
    async function sendEmailOnce() {
      // Only proceed if we haven't already started sending and have the required data
      if (
        !hasInitiatedSendRef.current &&
        userInfo?.email &&
        evaluationId &&
        !isLoading
      ) {
        // Set the flag immediately before doing anything else
        hasInitiatedSendRef.current = true;
        await sendResultsEmail();
      }
    }

    // Call the function immediately
    sendEmailOnce();

    // Cleanup function
    return () => {
      // This ensures if the component unmounts during send, we still mark it as initiated
      hasInitiatedSendRef.current = true;
    };
    // intentionally empty dependency array - we only want this to run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendResultsEmail = async () => {
    if (!userInfo?.email || !evaluationId) {
      console.error("Missing required fields for sending email");
      return;
    }

    try {
      setIsLoading(true);

      console.log("Sending email request to API...");
      const response = await fetch("/api/send-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInfo,
          evaluationId,
          email: userInfo.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email");
      }

      setEmailSent(true);
      console.log("Email sent successfully");
      toast({
        title: "Email enviado",
        description:
          "Los resultados han sido enviados a su correo electrónico.",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description:
          "No se pudo enviar el correo electrónico. Por favor intente más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    // If we have an evaluation ID, use that for the share URL
    const linkToShare = evaluationId
      ? `${window.location.origin}/results/${evaluationId}`
      : shareUrl || window.location.href;

    if (linkToShare) {
      navigator.clipboard.writeText(linkToShare);
      toast({
        title: "Enlace copiado",
        description: "El enlace ha sido copiado al portapapeles.",
      });
    }
  };

  const handleSendEmail = () => {
    // If we have an evaluation ID, use that for the share URL
    const linkToShare = evaluationId
      ? `${window.location.origin}/results/${evaluationId}`
      : shareUrl || window.location.href;

    if (linkToShare) {
      window.location.href = `mailto:?subject=Resultados de Evaluación de Ciberseguridad&body=Consulte mis resultados aquí: ${linkToShare}`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Left sidebar */}
      <div className="bg-[#FFD700] w-full md:w-2/5 p-2 md:p-4 flex flex-col min-h-screen md:min-h-0">
        <div className="flex justify-start">
          <SimpleHeader />
        </div>
        <div className="flex-grow flex items-center justify-center py-8 md:py-0">
          <AnimatedSecuritySVG />
        </div>
      </div>

      {/* Right content */}
      <div className="w-full md:w-3/5 p-4 md:p-16 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto space-y-8"
        >
          <h1 className="text-2xl md:text-4xl font-bold">
            {userInfo.firstName}, ¡Sus resultados están listos!
          </h1>
          <p className="text-base md:text-lg text-gray-700">
            Hemos evaluado el nivel de madurez en ciberseguridad de su
            organización. Descubra las áreas de fortaleza y oportunidades de
            mejora.
          </p>

          {emailSent && (
            <p className="text-sm text-green-600 font-medium">
              Los resultados también han sido enviados a su correo electrónico.
            </p>
          )}

          <Button
            onClick={onViewResults}
            className="w-full bg-black text-white hover:bg-gray-800 rounded-full py-6 text-lg"
          >
            Ver Resultados
          </Button>

          {(shareUrl || evaluationId) && (
            <div className="space-y-4">
              <p className="font-medium">Compartir resultados</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-black text-black hover:bg-gray-100 rounded-full py-6"
                >
                  <Copy size={20} />
                  <span>Copiar enlace</span>
                </Button>
              </div>
            </div>
          )}

          {/* Advanced Evaluation CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
            className="mt-8 p-6 border-2 border-yellow-400 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 shadow-md relative overflow-hidden"
          >
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-yellow-300 opacity-20 rounded-full"></div>
            <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-yellow-300 opacity-10 rounded-full"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-yellow-400 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-black"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">
                  ⚠️ Advertencia: Evaluación Limitada
                </h3>
              </div>

              <p className="text-gray-700 mb-4">
                <strong className="text-yellow-700">IMPORTANTE:</strong> Los
                resultados que está viendo son de una evaluación básica e
                inicial. Para un diagnóstico completo y profesional de su
                ciberseguridad, necesita la evaluación avanzada.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div className="bg-white bg-opacity-70 border border-yellow-300 rounded-lg p-3 flex items-start">
                  <span className="text-xl text-yellow-600 mr-2">✓</span>
                  <span className="text-sm">25 preguntas especializadas</span>
                </div>
                <div className="bg-white bg-opacity-70 border border-yellow-300 rounded-lg p-3 flex items-start">
                  <span className="text-xl text-yellow-600 mr-2">✓</span>
                  <span className="text-sm">Análisis basado en ISO 27001</span>
                </div>
                <div className="bg-white bg-opacity-70 border border-yellow-300 rounded-lg p-3 flex items-start">
                  <span className="text-xl text-yellow-600 mr-2">✓</span>
                  <span className="text-sm">Plan de acción detallado</span>
                </div>
                <div className="bg-white bg-opacity-70 border border-yellow-300 rounded-lg p-3 flex items-start">
                  <span className="text-xl text-yellow-600 mr-2">✓</span>
                  <span className="text-sm">Dashboard de seguridad</span>
                </div>
              </div>

              <Button
                onClick={() => (window.location.href = "/pricing")}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black rounded-full py-6 text-lg font-semibold shadow-md"
              >
                Actualizar a evaluación avanzada
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
