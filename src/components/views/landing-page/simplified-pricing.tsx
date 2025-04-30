"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Database,
  Bell,
  Users,
  Clock,
  Layers,
  Zap,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SimplifiedPricing() {
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

  const shimmer = {
    hidden: { backgroundPosition: "0% 0%" },
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: {
        repeat: Infinity,
        repeatType: "mirror" as const,
        duration: 3,
      },
    },
  };

  const float = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        repeat: Infinity,
        repeatType: "mirror" as const,
        duration: 4,
      },
    },
  };

  const featureAnimation = {
    hidden: { opacity: 0, y: 10 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.4,
      },
    }),
  };

  return (
    <section id="precios" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nuestros Planes
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades y comienza a
            proteger tu empresa hoy mismo
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Premium Subscription Card */}
          <motion.div
            className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-8 flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden"
            variants={item}
            initial={float.initial}
            animate={float.animate}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial="hidden"
              variants={shimmer}
              animate="animate"
              style={{ backgroundSize: "200% 200%" }}
            />

            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="text-2xl font-bold text-white">Plan Premium</h3>
              <motion.div
                className="bg-white text-black rounded-full px-4 py-1 text-sm font-medium"
                initial={{ scale: 1 }}
                animate={{
                  scale: [1, 1.05, 1],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                }}
              >
                Recomendado
              </motion.div>
            </div>

            <div className="mb-6 relative z-10">
              <span className="text-4xl font-bold text-white">$25</span>
              <span className="text-white/80 ml-2">/mes</span>
            </div>

            <div className="mb-8 flex-grow relative z-10">
              <p className="text-white/90 mb-4">
                Accede a recursos exclusivos con nuestra suscripción mensual y
                mantén tu empresa protegida contra ciberataques.
              </p>

              <div className="space-y-4">
                <motion.div
                  className="flex items-start"
                  variants={featureAnimation}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={0}
                >
                  <motion.div
                    className="bg-white/20 p-2 rounded-full mr-3 mt-1"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Shield className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium text-white">
                      Evaluación completa
                    </h4>
                    <p className="text-white/80">
                      Evaluación exhaustiva de seguridad con 50+ puntos de
                      verificación
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start"
                  variants={featureAnimation}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={1}
                >
                  <motion.div
                    className="bg-white/20 p-2 rounded-full mr-3 mt-1"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Database className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium text-white">
                      Dashboard avanzado
                    </h4>
                    <p className="text-white/80">
                      Visualiza tu estado de seguridad con métricas detalladas y
                      personalizadas
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start"
                  variants={featureAnimation}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={2}
                >
                  <motion.div
                    className="bg-white/20 p-2 rounded-full mr-3 mt-1"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Bell className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium text-white">
                      Alertas en tiempo real
                    </h4>
                    <p className="text-white/80">
                      Monitoreo continuo de datos filtrados y vulnerabilidades
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start"
                  variants={featureAnimation}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={3}
                >
                  <motion.div
                    className="bg-white/20 p-2 rounded-full mr-3 mt-1"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Layers className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium text-white">
                      Verificación de brechas
                    </h4>
                    <p className="text-white/80">
                      Incluye tres consultas para verificar brechas de la
                      empresa
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start"
                  variants={featureAnimation}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={4}
                >
                  <motion.div
                    className="bg-white/20 p-2 rounded-full mr-3 mt-1"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Layers className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium text-white">
                      Módulos adicionales
                    </h4>
                    <p className="text-white/80">
                      Acceso a módulos especializados según tus necesidades
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10"
            >
              <Link href="/pricing">
                <Button className="w-full py-6 bg-black text-white hover:bg-gray-800 relative z-10">
                  <span className="relative z-10">Suscríbete ahora</span>
                </Button>
              </Link>
            </motion.div>

            <p className="text-center text-sm text-white/70 mt-4 relative z-10">
              Cancelación en cualquier momento
            </p>
          </motion.div>

          {/* Specialist Subscription Card */}
          <motion.div
            className="bg-white text-black rounded-xl p-8 flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden border-2 border-black"
            variants={item}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="text-2xl font-bold">Especialistas</h3>
              <motion.div
                className="bg-yellow-400 text-black rounded-full px-4 py-1 text-sm font-medium"
                initial={{ scale: 1 }}
                animate={{
                  scale: [1, 1.05, 1],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                }}
              >
                Personalizado
              </motion.div>
            </div>

            <div className="mb-6 relative z-10">
              <span className="text-4xl font-bold">Desde $490</span>
              <span className="text-gray-500 ml-2">/mes</span>
            </div>

            <div className="mb-8 flex-grow relative z-10">
              <p className="text-gray-700 mb-4">
                Contrata a nuestro equipo de especialistas por hora según tus
                necesidades específicas de ciberseguridad.
              </p>

              <div className="space-y-4">
                <motion.div
                  className="flex items-start"
                  variants={featureAnimation}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={0}
                >
                  <motion.div
                    className="bg-yellow-400 p-2 rounded-full mr-3 mt-1"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Clock className="h-5 w-5 text-black" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">Horas flexibles</h4>
                    <p className="text-gray-600">
                      10, 24 o 48 horas mensuales según tus necesidades
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start"
                  variants={featureAnimation}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={1}
                >
                  <motion.div
                    className="bg-yellow-400 p-2 rounded-full mr-3 mt-1"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Users className="h-5 w-5 text-black" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">Equipo dedicado</h4>
                    <p className="text-gray-600">
                      Especialistas y coordinador de seguridad asignados
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start"
                  variants={featureAnimation}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={2}
                >
                  <motion.div
                    className="bg-yellow-400 p-2 rounded-full mr-3 mt-1"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Shield className="h-5 w-5 text-black" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">Soluciones específicas</h4>
                    <p className="text-gray-600">
                      Servicios a medida para los desafíos de tu empresa
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start"
                  variants={featureAnimation}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={3}
                >
                  <motion.div
                    className="bg-yellow-400 p-2 rounded-full mr-3 mt-1"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Zap className="h-5 w-5 text-black" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">Implementación acelerada</h4>
                    <p className="text-gray-600">
                      Configuración rápida de tu dashboard y módulos
                      personalizados
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10"
            >
              <Link href="/pricing#hourly">
                <Button className="w-full py-6 bg-yellow-400 text-black hover:bg-yellow-500 relative z-10">
                  <span className="relative z-10">Ver planes por hora</span>
                </Button>
              </Link>
            </motion.div>

            <p className="text-center text-sm text-gray-500 mt-4 relative z-10">
              Sin compromisos a largo plazo
            </p>
          </motion.div>
        </motion.div>

        {/* Módulos Adicionales */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-6">
            🧩 Nuestros módulos adicionales
          </h3>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Personaliza tu plan con módulos especializados según tus necesidades
          </p>

          <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto mb-12">
            <div className="bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-5 w-5 text-orange-500" />
              </div>
              <h4 className="font-bold mb-2">Simple Evalúa</h4>
              <p className="text-sm text-gray-600">
                Diagnóstico del estado actual de ciberseguridad y plan de
                mejora.
              </p>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Bell className="h-5 w-5 text-orange-500" />
              </div>
              <h4 className="font-bold mb-2">Simple Breach</h4>
              <p className="text-sm text-gray-600">
                Revisa si los datos de tu empresa han sido comprometidos o
                filtrados.
              </p>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Layers className="h-5 w-5 text-orange-500" />
              </div>
              <h4 className="font-bold mb-2">Simple Scan</h4>
              <p className="text-sm text-gray-600">
                Escanea tu sitio web o aplicaciones en busca de
                vulnerabilidades.
              </p>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Database className="h-5 w-5 text-orange-500" />
              </div>
              <h4 className="font-bold mb-2">Simple API</h4>
              <p className="text-sm text-gray-600">
                Analiza la seguridad de tus APIs. Las APIs son el principal
                riesgo en fintech.
              </p>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-5 w-5 text-orange-500" />
              </div>
              <h4 className="font-bold mb-2">Simple Contrata</h4>
              <p className="text-sm text-gray-600">
                Accede al mejor equipo de profesionales de ciberseguridad en
                LATAM.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/pricing">
            <Button
              variant="outline"
              className="px-8 py-6 text-lg border-black"
            >
              Ver todos los planes y detalles
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
