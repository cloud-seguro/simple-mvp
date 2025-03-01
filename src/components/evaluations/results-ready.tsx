"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Copy, Mail } from "lucide-react"
import type { UserInfo } from "./user-info-form"
import { AnimatedSecuritySVG } from "@/components/ui/animated-security-svg"
import { SimpleHeader } from "@/components/ui/simple-header"

interface ResultsReadyProps {
  userInfo: UserInfo
  onViewResults: () => void
  shareUrl?: string
}

export function ResultsReady({ userInfo, onViewResults, shareUrl }: ResultsReadyProps) {
  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
    }
  }

  const handleSendEmail = () => {
    if (shareUrl) {
      window.location.href = `mailto:?subject=Resultados de Evaluación de Ciberseguridad&body=Vea mis resultados aquí: ${shareUrl}`
    }
  }

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <div className="bg-[#FFD700] w-full md:w-2/5 p-4 md:p-8 flex flex-col">
        <div className="mb-4 md:mb-8">
          <SimpleHeader className="text-primary" />
        </div>
        <div className="flex-grow flex items-center justify-center py-8 md:py-0">
          <AnimatedSecuritySVG />
        </div>
      </div>

      <div className="w-full md:w-3/5 p-4 md:p-16 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto space-y-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold">
            {userInfo.firstName}, ¡Sus resultados están listos!
          </h1>
          <p className="text-base md:text-lg">
            Hemos evaluado el nivel de madurez en ciberseguridad de su
            organización. Descubra las áreas de fortaleza y oportunidades de
            mejora.
          </p>

          <Button
            onClick={onViewResults}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
          >
            Ver Resultados
          </Button>

          {shareUrl && (
            <div className="space-y-4">
              <p className="font-medium">Compartir resultados</p>
              <div className="flex flex-col md:flex-row gap-4">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="flex items-center justify-center gap-2 border-primary text-primary w-full md:w-auto"
                >
                  <Copy size={16} />
                  <span>Copiar enlace</span>
                </Button>
                <Button
                  onClick={handleSendEmail}
                  variant="outline"
                  className="flex items-center justify-center gap-2 border-primary text-primary w-full md:w-auto"
                >
                  <Mail size={16} />
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

