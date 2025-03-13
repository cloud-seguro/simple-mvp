"use client";

import { Shield, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EvaluationOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EvaluationOptionsModal({
  open,
  onOpenChange,
}: EvaluationOptionsModalProps) {
  const router = useRouter();

  const handleInitialEvaluation = () => {
    router.push("/evaluation/initial");
    onOpenChange(false);
  };

  const handleAdvancedEvaluation = () => {
    router.push("/evaluation/advanced");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Selecciona el tipo de evaluación
          </DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-8 mt-4">
          {/* Evaluación Inicial */}
          <div
            className="bg-orange-400 rounded-xl p-6 flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer text-left"
            onClick={handleInitialEvaluation}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleInitialEvaluation();
              }
            }}
            aria-label="Comenzar Evaluación Inicial"
          >
            <div className="mb-4 flex justify-center">
              <div className="bg-black rounded-full p-3 inline-block">
                <Shield size={36} className="text-orange-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 text-center">
              Evaluación Inicial
            </h3>
            <div className="flex-grow">
              <p className="mb-4 text-center text-sm">
                Ideal para empresas que están comenzando su camino en
                ciberseguridad o necesitan una evaluación básica de su postura
                de seguridad.
              </p>
              <ul className="mb-4 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-black mr-2 font-bold">✓</span>
                  <span>Evaluación de 10 preguntas clave</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2 font-bold">✓</span>
                  <span>Identificación de vulnerabilidades básicas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2 font-bold">✓</span>
                  <span>Recomendaciones iniciales</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2 font-bold">✓</span>
                  <span>Tiempo estimado: 5-10 minutos</span>
                </li>
              </ul>
            </div>
            <div className="w-full">
              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleInitialEvaluation();
                }}
              >
                Comenzar Evaluación Inicial
              </Button>
            </div>
          </div>

          {/* Evaluación Avanzada */}
          <div
            className="bg-yellow-400 rounded-xl p-6 flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer text-left"
            onClick={handleAdvancedEvaluation}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleAdvancedEvaluation();
              }
            }}
            aria-label="Comenzar Evaluación Avanzada"
          >
            <div className="mb-4 flex justify-center">
              <div className="bg-black rounded-full p-3 inline-block">
                <Lock size={36} className="text-yellow-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 text-center">
              Evaluación Avanzada
            </h3>
            <div className="flex-grow">
              <p className="mb-4 text-center text-sm">
                Para empresas que ya tienen medidas de seguridad implementadas y
                buscan una evaluación más profunda basada en estándares como ISO
                27001 o NIST.
              </p>
              <ul className="mb-4 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-black mr-2 font-bold">✓</span>
                  <span>Evaluación completa de 25 preguntas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2 font-bold">✓</span>
                  <span>Análisis basado en marcos de referencia</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2 font-bold">✓</span>
                  <span>Plan de acción detallado</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2 font-bold">✓</span>
                  <span>Tiempo estimado: 15-20 minutos</span>
                </li>
              </ul>
            </div>
            <div className="w-full">
              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdvancedEvaluation();
                }}
              >
                Comenzar Evaluación Avanzada
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
