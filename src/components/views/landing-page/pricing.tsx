"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Shield,
  Database,
  Lock,
  Check,
  X,
  Search,
  Users,
  FileText,
  BarChart4,
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
            Obtén acceso a nuestro dashboard intuitivo y módulos especializados
            para mantener tu empresa segura contra amenazas cibernéticas
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16"
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
              <h3 className="text-2xl font-bold">Plan Gratis</h3>
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
                    <Database className="h-5 w-5 text-black" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">Dashboard básico</h4>
                    <p className="text-gray-600">
                      Acceso a visualización básica de tu nivel de seguridad
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

          {/* Basic Card (formerly Premium) */}
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

            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-2xl font-bold text-white">Plan Basic</h3>
              <motion.div
                className="bg-black text-white rounded-full px-4 py-1 text-sm font-medium"
                initial={pulse.initial}
                animate={pulse.animate}
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
                      25 preguntas clave alineadas a estándares como ISO 27001 y
                      NIST
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
                    <h4 className="font-medium text-white">Dashboard básico</h4>
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
                      10 consultas mensuales para verificar brechas
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
                      Descarga y comparte tu reporte de evaluación en PDF
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
              Ideal para startups y empresas en crecimiento
            </p>
          </motion.div>

          {/* Pro Plan Card - Coming Soon */}
          <motion.div
            className="bg-white rounded-xl p-8 flex flex-col h-full border-2 border-black shadow-md"
            variants={item}
            initial={float.initial}
            animate={float.animate}
            whileHover={{
              scale: 1.03,
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Plan Pro</h3>
              <motion.div
                className="bg-yellow-400 text-black rounded-full px-4 py-1 text-sm font-medium"
                initial={pulse.initial}
                animate={pulse.animate}
              >
                Muy pronto
              </motion.div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold">$300</span>
              <span className="text-gray-500 ml-2">/mes</span>
            </div>

            <div className="mb-8 flex-grow">
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
                      Evalúa vulnerabilidades en tus plataformas web,
                      aplicaciones y APIs
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
                    <Bell className="h-5 w-5 text-yellow-600" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">20 consultas Simple Breach</h4>
                    <p className="text-gray-600">
                      Verifica correos y dominios comprometidos con mayor
                      alcance
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
                    <Database className="h-5 w-5 text-yellow-600" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">Dashboard completo</h4>
                    <p className="text-gray-600">
                      Métricas avanzadas, evolución histórica y tendencias
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
                    <Users className="h-5 w-5 text-yellow-600" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">1 hora con especialista</h4>
                    <p className="text-gray-600">
                      Un experto te ayuda a interpretar resultados y mejorar tu
                      nivel
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="w-full py-6 bg-yellow-400 text-black hover:bg-yellow-500"
                disabled
              >
                Próximamente
              </Button>
            </motion.div>

            <p className="text-center text-sm text-gray-500 mt-4">
              Ideal para empresas en procesos de certificación
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
                  <th className="text-left py-4 px-2 md:px-4 w-1/3">
                    Funcionalidad
                  </th>
                  <th className="text-center py-4 px-2 md:px-4">Plan Gratis</th>
                  <th className="text-center py-4 px-2 md:px-4 bg-yellow-50">
                    Plan Basic
                  </th>
                  <th className="text-center py-4 px-2 md:px-4 bg-black/5">
                    Plan Pro
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
                  <td className="text-center py-4 px-2 md:px-4 bg-yellow-50 font-medium">
                    Especializada (25 preguntas)
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-black/5 font-medium">
                    Completa (50+ puntos)
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-2 md:px-4 font-medium">
                    Dashboard interactivo
                  </td>
                  <td className="text-center py-4 px-2 md:px-4">Básico</td>
                  <td className="text-center py-4 px-2 md:px-4 bg-yellow-50">
                    Básico con comparativa
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-black/5">
                    Completo y comparativo
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-2 md:px-4 font-medium">
                    Simple Breach
                  </td>
                  <td className="text-center py-4 px-2 md:px-4">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-yellow-50">
                    10 consultas/mes
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-black/5">
                    20 consultas/mes
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-2 md:px-4 font-medium">Simple Scan</td>
                  <td className="text-center py-4 px-2 md:px-4">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-yellow-50">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-black/5">
                    <Check className="h-5 w-5 text-yellow-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-2 md:px-4 font-medium">Simple API</td>
                  <td className="text-center py-4 px-2 md:px-4">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-yellow-50">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-black/5">
                    <Check className="h-5 w-5 text-yellow-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-2 md:px-4 font-medium">
                    Alertas en tiempo real
                  </td>
                  <td className="text-center py-4 px-2 md:px-4">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-yellow-50">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-black/5">
                    <Check className="h-5 w-5 text-yellow-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-2 md:px-4 font-medium">
                    Informes exportables
                  </td>
                  <td className="text-center py-4 px-2 md:px-4">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-yellow-50">
                    PDF Básico
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-black/5">
                    PDF Detallado
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-2 md:px-4 font-medium">
                    Acceso a Simple Contrata
                  </td>
                  <td className="text-center py-4 px-2 md:px-4">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-yellow-50">
                    <Check className="h-5 w-5 text-yellow-600 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-black/5">
                    Acceso completo
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-2 md:px-4 font-medium">
                    Soporte técnico
                  </td>
                  <td className="text-center py-4 px-2 md:px-4">Email</td>
                  <td className="text-center py-4 px-2 md:px-4 bg-yellow-50">
                    Email
                  </td>
                  <td className="text-center py-4 px-2 md:px-4 bg-black/5">
                    Email + Chat + 1 hora especialista
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Modules Section */}
        <motion.div
          className="max-w-5xl mx-auto mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              🧩 Nuestros módulos adicionales
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Personaliza tu experiencia con módulos especializados que se
              integran perfectamente con tu dashboard
            </p>
          </div>

          <div className="overflow-x-auto mb-10">
            <table className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-500">
                    Módulo
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-500">
                    Función
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-500">
                    Precio individual
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray-500">
                    Incluido en Plan Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="py-4 px-6 font-medium">Simple Evalúa</td>
                  <td className="py-4 px-6 text-gray-600">
                    Diagnóstico alineado con ISO/NIST + plan de mejora.
                  </td>
                  <td className="py-4 px-6 font-medium">$39.00/mes</td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-4 px-6 font-medium">Simple Breach</td>
                  <td className="py-4 px-6 text-gray-600">
                    Revisa si tus correos o dominios han sido filtrados (10
                    consultas).
                  </td>
                  <td className="py-4 px-6 font-medium">$49.00/mes</td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-4 px-6 font-medium">Simple Scan</td>
                  <td className="py-4 px-6 text-gray-600">
                    Escaneo técnico de vulnerabilidades en sitios web o apps.
                  </td>
                  <td className="py-4 px-6 font-medium">$79.00/mes</td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-4 px-6 font-medium">Simple API</td>
                  <td className="py-4 px-6 text-gray-600">
                    Análisis de seguridad en tus APIs con enfoque técnico.
                  </td>
                  <td className="py-4 px-6 font-medium">$89.00/mes</td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-4 px-6 font-medium">Simple Contrata</td>
                  <td className="py-4 px-6 text-gray-600">
                    1 hora de acompañamiento con especialista (valor real desde
                    $150 USD). En simple pro tienes una hora con un experto.
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    Incluido en Pro (valor $150 USD)
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">Simple Evalúa</h3>
              <p className="text-gray-600 mb-4">
                Diagnóstico alineado con ISO/NIST + plan de mejora.
              </p>
              <div className="flex items-baseline justify-between mt-auto">
                <span className="text-sm font-medium text-gray-500">desde</span>
                <span className="text-lg font-bold">$39.00/mes</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">Simple Breach</h3>
              <p className="text-gray-600 mb-4">
                Revisa si tus correos o dominios han sido filtrados (10
                consultas).
              </p>
              <div className="flex items-baseline justify-between mt-auto">
                <span className="text-sm font-medium text-gray-500">desde</span>
                <span className="text-lg font-bold">$49.00/mes</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">Simple Scan</h3>
              <p className="text-gray-600 mb-4">
                Escaneo técnico de vulnerabilidades en sitios web o apps.
              </p>
              <div className="flex items-baseline justify-between mt-auto">
                <span className="text-sm font-medium text-gray-500">desde</span>
                <span className="text-lg font-bold">$79.00/mes</span>
              </div>
            </div>
          </div>

          {/* Additional Modules */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start">
                <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 flex items-center justify-center mr-4">
                  <Database className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2">Simple API</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Análisis de seguridad en tus APIs con enfoque técnico.
                  </p>
                  <div className="flex items-baseline">
                    <span className="text-sm font-medium text-gray-500 mr-2">
                      desde
                    </span>
                    <span className="text-lg font-bold">$89.00/mes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start">
                <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2">Simple Contrata</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    1 hora de acompañamiento con especialista incluido en Plan
                    Pro.
                  </p>
                  <div className="flex items-baseline">
                    <span className="text-sm font-medium text-gray-500 mr-2">
                      valor real desde
                    </span>
                    <span className="text-lg font-bold">$150 USD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Todos los módulos incluyen actualizaciones regulares y soporte
              técnico
            </p>
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3">
              Hablar con un especialista
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
