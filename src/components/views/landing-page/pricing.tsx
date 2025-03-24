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
            className="inline-block bg-yellow-100 text-black px-4 py-2 rounded-full text-sm font-medium mb-3"
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
            className="bg-white rounded-xl p-8 flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
            variants={item}
            initial={float.initial}
            animate={float.animate}
            whileHover={{
              scale: 1.03,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Plan Básico</h3>
              <motion.div
                className="bg-yellow-100 text-black rounded-full px-4 py-1 text-sm font-medium"
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
                    className="bg-yellow-100 p-2 rounded-full mr-3 mt-1"
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
                    className="bg-yellow-100 p-2 rounded-full mr-3 mt-1"
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
                    className="bg-yellow-100 p-2 rounded-full mr-3 mt-1"
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

            <motion.div
              className="absolute -right-12 -top-12 w-24 h-24 bg-yellow-300 rotate-45 transform origin-bottom-left"
              animate={{
                rotate: [45, 50, 45],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror" as const,
              }}
            ></motion.div>
            <div className="absolute right-0 top-5 z-10 text-xs font-bold text-black rotate-45">
              POPULAR
            </div>

            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-2xl font-bold text-white">
                Suscripción Premium
              </h3>
              <motion.div
                className="bg-white text-black rounded-full px-4 py-1 text-sm font-medium"
                initial={pulse.initial}
                animate={pulse.animate}
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
                    <Mail className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium text-white">
                      Soporte prioritario
                    </h4>
                    <p className="text-white/80">
                      Acceso a consultas ilimitadas con nuestros especialistas
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
              <Button className="w-full py-6 bg-black text-white hover:bg-gray-800 relative z-10 group overflow-hidden">
                <span className="relative z-10">Suscríbete ahora</span>
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
            </motion.div>

            <p className="text-center text-sm text-white/70 mt-4 relative z-10">
              Cancelación en cualquier momento
            </p>
          </motion.div>
        </motion.div>

        {/* Compare Plans */}
        <motion.div
          className="mt-20 bg-gray-50 p-8 rounded-xl max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-6 text-center">
            Comparación de planes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 text-left">Funcionalidad</th>
                  <th className="py-3 text-center">Gratuito</th>
                  <th className="py-3 text-center">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Evaluación de seguridad",
                    free: "Básica (15 preguntas)",
                    premium: "Avanzada (50+ preguntas)",
                  },
                  {
                    feature: "Monitoreo de filtraciones",
                    free: <X className="mx-auto text-gray-400" />,
                    premium: <Check className="mx-auto text-green-500" />,
                  },
                  {
                    feature: "Alertas en tiempo real",
                    free: <X className="mx-auto text-gray-400" />,
                    premium: <Check className="mx-auto text-green-500" />,
                  },
                  {
                    feature: "Dashboard personalizado",
                    free: <X className="mx-auto text-gray-400" />,
                    premium: <Check className="mx-auto text-green-500" />,
                  },
                  {
                    feature: "Consultas con especialistas",
                    free: "Limitadas",
                    premium: "Ilimitadas",
                  },
                  {
                    feature: "Informe de vulnerabilidades",
                    free: "Básico",
                    premium: "Detallado + Recomendaciones",
                  },
                ].map((row, index) => (
                  <tr
                    key={index}
                    className={`${
                      index !== 5 ? "border-b border-gray-200" : ""
                    }`}
                  >
                    <td className="py-4">{row.feature}</td>
                    <td className="py-4 text-center">
                      {typeof row.free === "string" ? (
                        row.free
                      ) : (
                        <div className="flex justify-center">{row.free}</div>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {typeof row.premium === "string" ? (
                        <motion.div
                          whileHover={{ y: -5 }}
                          className="font-bold text-black mb-1"
                        >
                          {row.premium}
                        </motion.div>
                      ) : (
                        <div className="flex justify-center">{row.premium}</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
