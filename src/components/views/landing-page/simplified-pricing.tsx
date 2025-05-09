"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Database,
  Bell,
  Users,
  Layers,
  Search,
  FileText,
  BarChart4,
  CheckCircle,
  FileDigit,
  Check,
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
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Free Plan Card */}
          <motion.div
            className="bg-white rounded-xl p-8 flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
            variants={item}
            initial={float.initial}
            animate={float.animate}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="text-2xl font-bold">Plan Gratuito</h3>
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
                Gratis
              </motion.div>
            </div>

            <div className="mb-6 relative z-10">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-500 ml-2">/siempre</span>
            </div>

            <div className="mb-8 flex-grow relative z-10">
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
                    <Shield className="h-5 w-5 text-yellow-600" />
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
                    <CheckCircle className="h-5 w-5 text-yellow-600" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">Recomendaciones iniciales</h4>
                    <p className="text-gray-600">
                      Sugerencias básicas para mejorar tu seguridad
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
              <Link href="/evaluation/initial">
                <Button className="w-full py-6 bg-black text-white hover:bg-gray-800 relative z-10">
                  <span className="relative z-10">Comenzar gratis</span>
                </Button>
              </Link>
            </motion.div>

            <p className="text-center text-sm text-gray-500 mt-4 relative z-10">
              No requiere tarjeta de crédito
            </p>
          </motion.div>

          {/* Basic Plan Card (formerly Premium) */}
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
              <h3 className="text-2xl font-bold text-white">Plan Basic</h3>
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
              <span className="text-4xl font-bold text-white">$30</span>
              <span className="text-white/80 ml-2">/mes</span>
            </div>

            <div className="mb-8 flex-grow relative z-10">
              <p className="text-white/90 mb-4">
                La forma más directa de empezar a gestionar la ciberseguridad de
                tu empresa con herramientas simples y efectivas.
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
                      Evaluación especializada
                    </h4>
                    <p className="text-white/80">
                      25 preguntas clave alineadas a estándares ISO 27001 y NIST
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
                    <BarChart4 className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium text-white">Comparación</h4>
                    <p className="text-white/80">
                      Compara tu nivel de madurez y revisa tus avances
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
                      Acceso al dashboard
                    </h4>
                    <p className="text-white/80">
                      Visualiza tu nivel de madurez y haz seguimiento
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
                    <Bell className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium text-white">Simple Breach</h4>
                    <p className="text-white/80">
                      10 consultas mensuales para verificar brechas de datos
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
                    <FileText className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium text-white">
                      Exporta tu informe
                    </h4>
                    <p className="text-white/80">
                      Descarga y comparte tu informe de evaluación en PDF
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
              Ideal para startups y empresas en crecimiento
            </p>
          </motion.div>

          {/* Pro Plan Card */}
          <motion.div
            className="bg-white text-black rounded-xl p-8 flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden border-2 border-black"
            variants={item}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="text-2xl font-bold">Plan Pro</h3>
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
                Muy pronto
              </motion.div>
            </div>

            <div className="mb-6 relative z-10">
              <span className="text-4xl font-bold">$300</span>
              <span className="text-gray-500 ml-2">/mes</span>
            </div>

            <div className="mb-8 flex-grow relative z-10">
              <p className="text-gray-700 mb-4">
                Avanza en la madurez de tu ciberseguridad con herramientas más
                profundas y apoyo experto.
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
                    <Search className="h-5 w-5 text-yellow-600" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">Simple Scan</h4>
                    <p className="text-gray-600">
                      Evalúa vulnerabilidades en plataformas web, aplicaciones y
                      APIs
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
                    <BarChart4 className="h-5 w-5 text-yellow-600" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">Dashboard completo</h4>
                    <p className="text-gray-600">
                      Acceso total a métricas, evolución histórica y tendencias
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
                    <Bell className="h-5 w-5 text-yellow-600" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">20 consultas Simple Breach</h4>
                    <p className="text-gray-600">
                      Verifica correos y dominios comprometidos con más alcance
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
                    className="bg-yellow-100 p-2 rounded-full mr-3 mt-1"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <FileDigit className="h-5 w-5 text-yellow-600" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">Informe detallado</h4>
                    <p className="text-gray-600">
                      Recomendaciones priorizadas para tu negocio en PDF
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
                    className="bg-yellow-100 p-2 rounded-full mr-3 mt-1"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Users className="h-5 w-5 text-yellow-600" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">1 hora con especialista</h4>
                    <p className="text-gray-600">
                      Experto te acompaña para interpretar resultados
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
                <Button
                  className="w-full py-6 bg-yellow-400 text-black hover:bg-yellow-500 relative z-10"
                  disabled
                >
                  <span className="relative z-10">Próximamente</span>
                </Button>
              </Link>
            </motion.div>

            <p className="text-center text-sm text-gray-500 mt-4 relative z-10">
              Ideal para empresas en procesos de certificación
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

          <div className="overflow-x-auto mb-10">
            <table className="w-full max-w-5xl mx-auto bg-white rounded-lg shadow-md">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-4 px-4 text-left">Módulo</th>
                  <th className="py-4 px-4 text-left">Función</th>
                  <th className="py-4 px-4 text-left">Precio individual</th>
                  <th className="py-4 px-4 text-center">
                    Incluido en Plan Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Simple Evalúa</td>
                  <td className="py-4 px-4">
                    Diagnóstico alineado con ISO/NIST + plan de mejora.
                  </td>
                  <td className="py-4 px-4">$39.00/mes</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Simple Breach</td>
                  <td className="py-4 px-4">
                    Revisa si tus correos o dominios han sido filtrados (10
                    consultas).
                  </td>
                  <td className="py-4 px-4">$49.00/mes</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Simple Scan</td>
                  <td className="py-4 px-4">
                    Escaneo técnico de vulnerabilidades en sitios web o apps.
                  </td>
                  <td className="py-4 px-4">$79.00/mes</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Simple API</td>
                  <td className="py-4 px-4">
                    Análisis de seguridad en tus APIs con enfoque técnico.
                  </td>
                  <td className="py-4 px-4">$89.00/mes</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Simple Contrata</td>
                  <td className="py-4 px-4">
                    1 hora de acompañamiento con especialista (valor real desde
                    $150 USD). En simple pro tienes una hora con un experto.
                  </td>
                  <td className="py-4 px-4">
                    Incluido en Pro (valor $150 USD)
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto mb-12">
            <div className="bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-6 w-6 text-black" />
              </div>
              <h4 className="font-bold mb-2">Simple Evalúa</h4>
              <p className="text-sm text-gray-600">
                Diagnóstico alineado con ISO/NIST + plan de mejora.
              </p>
              <p className="text-sm font-medium text-orange-600 mt-2">
                $39.00/mes
              </p>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                <Bell className="h-6 w-6 text-black" />
              </div>
              <h4 className="font-bold mb-2">Simple Breach</h4>
              <p className="text-sm text-gray-600">
                Revisa si tus correos o dominios han sido filtrados (10
                consultas).
              </p>
              <p className="text-sm font-medium text-orange-600 mt-2">
                $49.00/mes
              </p>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                <Layers className="h-6 w-6 text-black" />
              </div>
              <h4 className="font-bold mb-2">Simple Scan</h4>
              <p className="text-sm text-gray-600">
                Escaneo técnico de vulnerabilidades en sitios web o apps.
              </p>
              <p className="text-sm font-medium text-orange-600 mt-2">
                $79.00/mes
              </p>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                <Database className="h-6 w-6 text-black" />
              </div>
              <h4 className="font-bold mb-2">Simple API</h4>
              <p className="text-sm text-gray-600">
                Análisis de seguridad en tus APIs con enfoque técnico.
              </p>
              <p className="text-sm font-medium text-orange-600 mt-2">
                $89.00/mes
              </p>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 text-black" />
              </div>
              <h4 className="font-bold mb-2">Simple Contrata</h4>
              <p className="text-sm text-gray-600">
                1 hora de acompañamiento con especialista incluido en Plan Pro.
              </p>
              <p className="text-sm font-medium text-orange-600 mt-2">
                Incluido en Pro (valor $150 USD)
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
