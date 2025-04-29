"use client";

import { motion } from "framer-motion";
import { Shield, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function EvaluationOptions() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);


  useEffect(() => {
    async function checkAuthStatus() {
      try {
        // Check if user is logged in
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error checking auth session:", sessionError);
          setIsLoggedIn(false);
          setIsPremiumUser(false);
          return;
        }

        if (!session) {
          setIsLoggedIn(false);
          setIsPremiumUser(false);
          return;
        }

        // User is logged in
        setIsLoggedIn(true);

        // Use a simple approach for now - consider anyone logged in as potentially premium
        // In a production app, you would check subscription status from a reliable source
        setIsPremiumUser(true);
      } catch (error) {
        console.error("Unexpected error checking auth:", error);
        setIsLoggedIn(false);
        setIsPremiumUser(false);
      }
    }

    checkAuthStatus();
  }, [supabase]);

  const handleInitialEvaluation = () => {
    router.push("/evaluation/initial");
  };

  const handleAdvancedEvaluation = () => {
    if (isLoggedIn && isPremiumUser) {
      router.push("/evaluation/advanced");
    } else {
      router.push("/pricing");
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

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
            🔍 Diagnóstico inicial: empieza tu camino a la seguridad
          </h2>
          <p className="text-lg max-w-3xl mx-auto">
            Evalúa tu nivel de madurez en ciberseguridad
          </p>
          <p className="text-lg max-w-3xl mx-auto mt-2">
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
              ✅ Evaluación Gratuita
            </h3>
            <div className="flex-grow">
              <p className="mb-6 text-center">
                Conoce tu estado actual en menos de 5 minutos y recibe una guía
                de acción básica.
              </p>
              <ul className="mb-6 space-y-3">
                <li className="flex items-start">
                  <span className="text-black mr-2 font-bold">✓</span>
                  <span>Evaluación de 15 preguntas clave</span>
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
              Realizar evaluación gratuita
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
              🚀 Evaluación Avanzada (paga)
            </h3>
            <div className="flex-grow">
              <p className="mb-6 text-center">
                Diagnóstico completo, plan personalizado, acceso al dashboard y
                posibilidad de activar módulos especializados.
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
                  <span>Acceso al dashboard personalizado</span>
                </li>
              </ul>
            </div>
            <Button onClick={handleAdvancedEvaluation}>
              {isPremiumUser
                ? "Realizar evaluación avanzada"
                : "Ver planes premium"}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
