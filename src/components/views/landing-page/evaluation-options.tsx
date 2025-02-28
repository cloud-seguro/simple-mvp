"use client"

import { motion } from "framer-motion"
import { Shield, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function EvaluationOptions() {
  const router = useRouter();

  const handleInitialEvaluation = () => {
    router.push("/evaluation/initial");
  };

  const handleAdvancedEvaluation = () => {
    router.push("/evaluation/advanced");
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="py-20" id="evaluacion">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Evalúa tu nivel de madurez en ciberseguridad
          </h2>
          <p className="text-lg max-w-3xl mx-auto">
            Selecciona la evaluación que mejor se adapte a tus necesidades y
            descubre cómo mejorar la seguridad de tu empresa
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Evaluación Inicial */}
          <motion.div
            className="bg-orange-400 rounded-xl p-8 flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            variants={item}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="mb-6 flex justify-center">
              <div className="bg-black rounded-full p-4 inline-block">
                <Shield size={48} className="text-orange-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center">
              Evaluación Inicial
            </h3>
            <div className="flex-grow">
              <p className="mb-6 text-center">
                Ideal para empresas que están comenzando su camino en
                ciberseguridad o necesitan una evaluación básica de su postura de
                seguridad.
              </p>
              <ul className="mb-6 space-y-3">
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
            <Button onClick={handleInitialEvaluation}>
              Comenzar Evaluación Inicial
            </Button>
          </motion.div>

          {/* Evaluación Avanzada */}
          <motion.div
            className="bg-yellow-400 rounded-xl p-8 flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            variants={item}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="mb-6 flex justify-center">
              <div className="bg-black rounded-full p-4 inline-block">
                <Lock size={48} className="text-yellow-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center">
              Evaluación Avanzada
            </h3>
            <div className="flex-grow">
              <p className="mb-6 text-center">
                Para empresas que ya tienen medidas de seguridad implementadas y
                buscan una evaluación más profunda basada en estándares como ISO
                27001 o NIST.
              </p>
              <ul className="mb-6 space-y-3">
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
            <Button onClick={handleAdvancedEvaluation}>
              Comenzar Evaluación Avanzada
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

