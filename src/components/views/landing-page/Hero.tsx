"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HyperText } from "@/components/magicui/hyper-text";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.querySelector("#evaluacion");
    if (element) {
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (!mounted) return null;

  return (
    <section className="py-32 px-4 md:py-40 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Mobile Layout (Hidden on Desktop) */}
        <div className="flex flex-col md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <HyperText
              className="text-4xl font-bold leading-tight text-black"
              startOnView={true}
            >
              Hacemos lo complejo de la Ciberseguridad Simple
            </HyperText>
          </motion.div>

          <motion.div className="flex justify-center mb-8">
            <div className="relative w-full max-w-[250px] aspect-square">
              <motion.svg
                viewBox="0 0 200 200"
                className="w-full h-full"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 50,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                aria-label="Círculo animado"
                role="img"
              >
                <g fill="none" stroke="black" strokeWidth="2">
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="70"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                  <motion.path
                    d="M100,30 L100,170 M30,100 L170,100"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2,
                      delay: 0.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                  <motion.path
                    d="M65,65 L135,135 M65,135 L135,65"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2,
                      delay: 1,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                </g>
                <circle cx="100" cy="100" r="30" fill="black">
                  <animate
                    attributeName="r"
                    values="30;35;30"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </motion.svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <p className="text-lg mb-8 text-black">
              La ciberseguridad no tiene que ser difícil ni costosa. Con nuestro
              enfoque, te ayudamos a entender tu nivel actual de seguridad a
              través de evaluaciones personalizadas.
            </p>
            <div className="flex flex-col gap-4">
              <Button
                className="w-full bg-black text-white px-6 py-6 rounded-md hover:bg-gray-800 transition-all transform hover:-translate-y-1 text-lg"
                onClick={handleNavClick}
              >
                Comenzar Evaluación
              </Button>
              <Link href="/pricing" className="w-full">
                <Button className="w-full bg-white text-black border-2 border-black px-6 py-6 rounded-md hover:bg-gray-100 transition-all transform hover:-translate-y-1 text-lg">
                  Ver Precios
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Desktop Layout (Hidden on Mobile) */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HyperText
              className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-black"
              startOnView={true}
            >
              Hacemos lo complejo de la Ciberseguridad Simple
            </HyperText>
            <p className="text-xl mb-8 text-black">
              La ciberseguridad no tiene que ser difícil ni costosa. Con nuestro
              enfoque, te ayudamos a entender tu nivel actual de seguridad a
              través de evaluaciones personalizadas.
            </p>
            <div className="flex flex-row gap-4">
              <Button
                className="bg-black text-white px-6 py-6 rounded-md hover:bg-gray-800 transition-all transform hover:-translate-y-1 text-lg"
                onClick={handleNavClick}
              >
                Comenzar Evaluación
              </Button>
              <Link href="/pricing">
                <Button className="bg-white text-black border-2 border-black px-6 py-6 rounded-md hover:bg-gray-100 transition-all transform hover:-translate-y-1 text-lg">
                  Ver Precios
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div className="flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <motion.svg
                viewBox="0 0 200 200"
                className="w-full h-full"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 50,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                aria-label="Círculo animado"
                role="img"
              >
                <g fill="none" stroke="black" strokeWidth="2">
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="70"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                  <motion.path
                    d="M100,30 L100,170 M30,100 L170,100"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2,
                      delay: 0.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                  <motion.path
                    d="M65,65 L135,135 M65,135 L135,65"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2,
                      delay: 1,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                </g>
                <circle cx="100" cy="100" r="30" fill="black">
                  <animate
                    attributeName="r"
                    values="30;35;30"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </motion.svg>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pricing CTA Card - Visible on all devices */}
      <div className="max-w-6xl mx-auto mt-16 md:mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-xl p-8 md:p-10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="md:max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">
                Planes diseñados para empresas de todos los tamaños
              </h2>
              <p className="text-lg text-black">
                Descubre nuestros planes y precios transparentes para proteger
                tu negocio con las soluciones más efectivas de ciberseguridad.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/pricing">
                <Button className="bg-black text-white px-6 py-6 md:py-7 rounded-md hover:bg-gray-800 transition-all transform hover:-translate-y-1 text-lg">
                  Ver Todos los Planes
                </Button>
              </Link>
              <Link href="/pricing#hourly">
                <Button className="bg-white text-black border-2 border-black px-6 py-6 md:py-7 rounded-md hover:bg-gray-100 transition-all transform hover:-translate-y-1 text-lg">
                  Consultar Tarifas
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
