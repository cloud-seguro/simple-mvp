"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Copy, Mail } from "lucide-react"
import type { UserInfo } from "./user-info-form"

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
      <div className="bg-background w-full md:w-2/5 p-8 flex flex-col border-r">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">SIMPLE</h1>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <img src="/security-illustration.svg" alt="" className="max-w-[250px] w-full h-auto" />
        </div>
      </div>

      <div className="w-full md:w-3/5 p-8 md:p-16 flex flex-col justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4">{userInfo.firstName}, ¡Sus resultados están listos!</h1>
          <p className="mb-8">
            Hemos evaluado el nivel de madurez en ciberseguridad de su organización. Descubra las áreas de fortaleza y
            oportunidades de mejora.
          </p>

          <Button
            onClick={onViewResults}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full mb-8"
          >
            Ver Resultados
          </Button>

          {shareUrl && (
            <div className="space-y-4">
              <p className="font-medium">Compartir resultados</p>
              <div className="flex gap-4">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="flex items-center gap-2 border-primary text-primary"
                >
                  <Copy size={16} />
                  Copiar enlace
                </Button>
                <Button
                  onClick={handleSendEmail}
                  variant="outline"
                  className="flex items-center gap-2 border-primary text-primary"
                >
                  <Mail size={16} />
                  Enviar por correo
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

