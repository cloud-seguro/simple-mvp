"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Shield,
  Database,
  Mail,
  Lock,
  Check,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pricing() {
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
        ease: "easeInOut",
      },
    },
  };

  const pulse = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        repeat: Infinity,
        repeatType: "mirror" as const,
        duration: 2,
        ease: "easeInOut",
      },
    },
  };

  const featureAnimation = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-20 bg-white" id="pricing">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-medium mb-3"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Protege tu empresa
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Planes de suscripción
          </motion.h2>
          <motion.p
            className="text-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Obtén acceso a herramientas avanzadas y monitoreo continuo para
            mantener tu empresa segura contra amenazas cibernéticas
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Free Card */}
          <motion.div
            className="bg-white rounded-xl p-8 flex flex-col h-full border border-gray-200"
            variants={item}
            initial={float.initial}
            animate={float.animate}
            whileHover={{
              scale: 1.03,
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Plan Básico</h3>
              <motion.div
                className="bg-yellow-400 text-black rounded-full px-4 py-1 text-sm font-medium"
                initial={pulse.initial}
                animate={pulse.animate}
              >
                Gratis
              </motion.div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-500 ml-2">/siempre</span>
            </div>

            <div className="mb-8 flex-grow">
              <p className="text-gray-700 mb-4">
                Comienza tu viaje hacia una mejor ciberseguridad con nuestro
                plan gratuito.
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
                    <Shield className="h-5 w-5 text-black" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">Evaluación inicial</h4>
                    <p className="text-gray-600">
                      Accede a nuestra evaluación de seguridad básica con 15
                      preguntas
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
                    <CheckCircle2 className="h-5 w-5 text-black" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">Resultados básicos</h4>
                    <p className="text-gray-600">
                      Recibe un informe con las principales vulnerabilidades
                      identificadas
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
                    <Lock className="h-5 w-5 text-black" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">Recomendaciones iniciales</h4>
                    <p className="text-gray-600">
                      Sugerencias básicas para mejorar tu postura de seguridad
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="w-full py-6 bg-black text-white hover:bg-gray-800">
                Comenzar gratis
              </Button>
            </motion.div>

            <p className="text-center text-sm text-gray-500 mt-4">
              No requiere tarjeta de crédito
            </p>
          </motion.div>

          {/* Premium Card */}
          <motion.div
            className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-8 flex flex-col h-full relative overflow-hidden"
            variants={item}
            initial={float.initial}
            animate={float.animate}
            whileHover={{
              scale: 1.03,
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
              <span className="text-4xl font-bold text-white">$49.99</span>
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
                  custom={2}
                >
                  <motion.div
                    className="bg-white/20 p-2 rounded-full mr-3 mt-1"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Database className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium text-white">
                      Dashboard personalizado
                    </h4>
                    <p className="text-white/80">
                      Visualiza tu estado de seguridad con métricas claras
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
              <Button className="w-full py-6 bg-black text-white hover:bg-gray-800 relative z-10">
                <span className="relative z-10">Suscríbete ahora</span>
              </Button>
            </motion.div>

            <p className="text-center text-sm text-white/70 mt-4 relative z-10">
              Cancelación en cualquier momento
            </p>
          </motion.div>
        </motion.div>

        {/* Features Comparison */}
        <motion.div
          className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold">
              Comparativa de funcionalidades
            </h3>
          </div>

          <div className="px-4 md:px-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-2 md:px-4 w-1/2">
                    Funcionalidad
                  </th>
                  <th className="text-center py-4 px-2 md:px-4">Plan Básico</th>
                  <th className="text-center py-4 px-2 md:px-4 bg-white">
                    Plan Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-2 md:px-4 font-medium">
                    Evaluación de seguridad
                  </td>
                  <td className="text-center py-4 px-2 md:px-4">
                    Básica (15 preguntas)
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-white font-medium">
                    Completa (50+ puntos)
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-2 md:px-4 font-medium">
                    Monitoreo continuo
                  </td>
                  <td className="text-center py-4 px-2 md:px-4">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-white">
                    <Check className="h-5 w-5 text-orange-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-2 md:px-4 font-medium">
                    Dashboard personalizado
                  </td>
                  <td className="text-center py-4 px-2 md:px-4">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-white">
                    <Check className="h-5 w-5 text-orange-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-2 md:px-4 font-medium">
                    Alertas en tiempo real
                  </td>
                  <td className="text-center py-4 px-2 md:px-4">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-white">
                    <Check className="h-5 w-5 text-orange-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-2 md:px-4 font-medium">
                    Detección de vulnerabilidades
                  </td>
                  <td className="text-center py-4 px-2 md:px-4">Limitada</td>
                  <td className="text-center py-4 px-2 md:px-4 bg-white font-medium">
                    Completa
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-2 md:px-4 font-medium">
                    Soporte técnico
                  </td>
                  <td className="text-center py-4 px-2 md:px-4">Email</td>
                  <td className="text-center py-4 px-2 md:px-4 bg-white font-medium">
                    Email + Chat prioritario
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
