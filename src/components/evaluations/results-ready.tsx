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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const emailSentRef = useRef(false);

  useEffect(() => {
    // Only send email if we have the required information and it hasn't been sent yet
    if (userInfo?.email && evaluationId && !emailSentRef.current) {
      emailSentRef.current = true; // Set flag immediately to prevent duplicate sends
      sendResultsEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.email, evaluationId]); // Added required dependencies

  const sendResultsEmail = async () => {
    if (!userInfo?.email || !evaluationId) {
      console.error("Missing required fields for sending email");
      return;
    }

    try {
      setIsLoading(true);
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
                <Button
                  onClick={handleSendEmail}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-black text-black hover:bg-gray-100 rounded-full py-6"
                >
                  <Mail size={20} />
                  <span>Enviar por correo</span>
                </Button>
              </div>
            </div>
          )}

          {/* Advanced Evaluation CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
            className="mt-8 p-6 border-2 border-yellow-400 rounded-xl bg-yellow-50"
          >
            <h3 className="text-xl font-bold mb-2">
              🚀 Mejore su seguridad con una evaluación avanzada
            </h3>
            <p className="text-gray-700 mb-4">
              Esta evaluación inicial le ofrece una visión básica de su
              seguridad. Obtenga un análisis completo, recomendaciones
              detalladas y un plan personalizado con nuestra evaluación
              avanzada.
            </p>
            <ul className="mb-4 space-y-2">
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2 font-bold">✓</span>
                <span>Evaluación completa de 25 preguntas</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2 font-bold">✓</span>
                <span>Análisis basado en marcos de referencia</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2 font-bold">✓</span>
                <span>Plan de acción detallado</span>
              </li>
            </ul>
            <Button
              onClick={() => (window.location.href = "/pricing")}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black rounded-full py-6 text-lg"
            >
              Actualizar a evaluación avanzada
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
