"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Copy, Mail } from "lucide-react";
import type { UserInfo } from "./types";
import { AnimatedSecuritySVG } from "@/components/ui/animated-security-svg";
import { SimpleHeader } from "@/components/ui/simple-header";
import { toast } from "@/components/ui/use-toast";

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
      <div className="bg-[#FFD700] w-full md:w-2/5 p-4 md:p-8 flex flex-col min-h-screen md:min-h-0">
        <div className="mb-4 md:mb-8">
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
        </motion.div>
      </div>
    </div>
  );
}
