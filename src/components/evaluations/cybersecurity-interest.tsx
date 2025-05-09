"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InterestOption } from "./types";
import { AnimatedSecuritySVG } from "@/components/ui/animated-security-svg";
import { SimpleHeader } from "@/components/ui/simple-header";

interface CybersecurityInterestProps {
  onSubmit: (reason: InterestOption, otherReason?: string) => void;
}

export function CybersecurityInterest({
  onSubmit,
}: CybersecurityInterestProps) {
  const [selectedReason, setSelectedReason] = useState<InterestOption | null>(
    null
  );
  const [otherReason, setOtherReason] = useState("");

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(
        selectedReason,
        selectedReason === "other" ? otherReason : undefined
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Left sidebar */}
      <div className="bg-[#FFD700] w-full md:w-2/5 p-2 md:p-4 flex flex-col">
        <div className="flex justify-start">
          <SimpleHeader className="hover:opacity-80 transition-opacity" />
        </div>
        <div className="flex-grow flex items-center justify-center py-8 md:py-0">
          <AnimatedSecuritySVG />
        </div>
      </div>

      {/* Right content */}
      <div className="w-full md:w-3/5 p-4 md:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold">Sobre su interés</h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-4">
              ¿Por qué te interesa conocer tu nivel de madurez en
              ciberseguridad?
            </h2>

            <p className="mb-6 text-gray-600">
              Selecciona la opción que mejor describe tu situación:
            </p>

            <div className="space-y-6">
              <RadioGroup
                value={selectedReason || ""}
                onValueChange={(value) =>
                  setSelectedReason(value as InterestOption)
                }
                className="space-y-3"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem
                    value="process"
                    id="process"
                    className="mt-1"
                  />
                  <Label
                    htmlFor="process"
                    className="font-normal cursor-pointer"
                  >
                    Estoy en un proceso de ciberseguridad en mi empresa.
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <RadioGroupItem
                    value="nothing"
                    id="nothing"
                    className="mt-1"
                  />
                  <Label
                    htmlFor="nothing"
                    className="font-normal cursor-pointer"
                  >
                    No tengo nada en mi empresa y quiero aumentar el nivel de
                    madurez.
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <RadioGroupItem
                    value="curiosity"
                    id="curiosity"
                    className="mt-1"
                  />
                  <Label
                    htmlFor="curiosity"
                    className="font-normal cursor-pointer"
                  >
                    Tengo curiosidad y quiero aprender más sobre ciberseguridad.
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <RadioGroupItem
                    value="requirement"
                    id="requirement"
                    className="mt-1"
                  />
                  <Label
                    htmlFor="requirement"
                    className="font-normal cursor-pointer"
                  >
                    Me piden evaluar la ciberseguridad en mi organización.
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="other" id="other" className="mt-1" />
                  <Label htmlFor="other" className="font-normal cursor-pointer">
                    Otro motivo (por favor especifica).
                  </Label>
                </div>
              </RadioGroup>

              {selectedReason === "other" && (
                <div className="mt-3">
                  <Textarea
                    placeholder="Por favor, describe tu motivo..."
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              )}

              <div className="mt-6">
                <p className="mb-4 text-gray-700 italic">
                  La ciberseguridad es compleja, pero nuestra misión es hacerla
                  SIMPLE.
                </p>

                <p className="mb-6 text-gray-600 text-sm">
                  Si deseas recibir un análisis más detallado o verificar la
                  implementación de controles y riesgos en tu empresa, podemos
                  ayudarte.
                </p>

                <Button
                  onClick={handleSubmit}
                  disabled={
                    !selectedReason ||
                    (selectedReason === "other" && !otherReason.trim())
                  }
                  className="w-full bg-black text-white hover:bg-gray-800 rounded-full"
                >
                  Continuar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
