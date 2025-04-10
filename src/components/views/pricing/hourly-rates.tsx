"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Search,
  Terminal,
  Database,
  Layers,
  Zap,
  Check,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HourlyRates() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-medium mb-3">
          Equipo de especialistas dedicados
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Asesoría especializada por hora para tu empresa
        </h2>
        <p className="text-lg max-w-3xl mx-auto">
          Nuestro equipo de especialistas te ayudará a configurar tu dashboard
          personalizado, implementar los módulos adecuados y brindar soporte
          continuo para maximizar tu seguridad.
        </p>
      </motion.div>

      <motion.div
        className="mt-12 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Stats banner */}
        <div className="bg-black text-center py-2 mb-8 font-medium text-white">
          IMPLEMENTACIÓN Y SOPORTE PROFESIONAL
        </div>

        {/* Pricing Cards Table */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Basic - 10 hours */}
            <div className="p-8 border-b md:border-b-0 md:border-r border-gray-200">
              <h3 className="text-3xl font-bold mb-2">Básico</h3>
              <div className="mb-6">
                <span className="text-5xl font-black">$490</span>
                <span className="text-gray-500 text-sm block">USD/mes</span>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-sm uppercase text-gray-500 mb-3">
                  QUÉ ESTÁ INCLUIDO
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-baseline">
                    <span className="inline-block bg-yellow-400 text-black rounded-full w-5 h-5 flex-shrink-0 mr-2"></span>
                    <span>10 horas de soporte mensual</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Configuración de dashboard básico</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Implementación de 1 módulo</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Asesoría técnica básica</span>
                  </li>
                </ul>
              </div>

              <div className="mb-8">
                <h4 className="font-bold text-sm uppercase text-gray-500 mb-3">
                  UN EQUIPO COMPUESTO POR
                </h4>
                <div>
                  <p>1 Coordinador de Seguridad</p>
                  <p>Especialistas en ciberseguridad</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full py-6 bg-yellow-400 text-black hover:bg-yellow-500 border-0"
              >
                Comenzar prueba gratis
              </Button>
            </div>

            {/* Standard - 24 hours */}
            <div className="p-8 border-b md:border-b-0 md:border-r border-gray-200 relative">
              <div className="absolute top-4 right-4 bg-yellow-400 text-xs text-black px-3 py-1 rounded-full font-medium">
                Más popular
              </div>
              <h3 className="text-3xl font-bold mb-2">Estándar</h3>
              <div className="mb-6">
                <span className="text-5xl font-black">$990</span>
                <span className="text-gray-500 text-sm block">USD/mes</span>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-sm uppercase text-gray-500 mb-3">
                  QUÉ ESTÁ INCLUIDO
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-baseline">
                    <span className="inline-block bg-yellow-400 text-black rounded-full w-5 h-5 flex-shrink-0 mr-2"></span>
                    <span>24 horas de soporte mensual</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Configuración de dashboard avanzado</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Implementación de 3 módulos</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Respuesta prioritaria a incidentes</span>
                  </li>
                </ul>
              </div>

              <div className="mb-8">
                <h4 className="font-bold text-sm uppercase text-gray-500 mb-3">
                  UN EQUIPO COMPUESTO POR
                </h4>
                <div>
                  <p>1 Coordinador de Seguridad</p>
                  <p>Especialistas en ciberseguridad</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full py-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 border-0"
              >
                Comenzar prueba gratis
              </Button>
            </div>

            {/* Premium - 48 hours */}
            <div className="p-8">
              <h3 className="text-3xl font-bold mb-2">Premium</h3>
              <div className="mb-6">
                <span className="text-5xl font-black">$1890</span>
                <span className="text-gray-500 text-sm block">USD/mes</span>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-sm uppercase text-gray-500 mb-3">
                  QUÉ ESTÁ INCLUIDO
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-baseline">
                    <span className="inline-block bg-yellow-400 text-black rounded-full w-5 h-5 flex-shrink-0 mr-2"></span>
                    <span>48 horas de soporte mensual</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Dashboard empresarial personalizado</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Implementación de módulos ilimitados</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Desarrollo de módulos a medida</span>
                  </li>
                </ul>
              </div>

              <div className="mb-8">
                <h4 className="font-bold text-sm uppercase text-gray-500 mb-3">
                  UN EQUIPO COMPUESTO POR
                </h4>
                <div>
                  <p>1 Coordinador de Seguridad</p>
                  <p>Especialistas en ciberseguridad senior</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full py-6 bg-black text-white hover:bg-gray-800 border-0"
              >
                Cotizar
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Module Implementation Services */}
      <motion.div
        className="mt-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Servicios de implementación y personalización
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
            Nuestros especialistas configuran e implementan módulos adaptados a
            tus necesidades específicas
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              Implementación de Dashboard
            </h3>
            <p className="text-gray-600">
              Configuración personalizada del dashboard según las necesidades
              específicas de tu empresa.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Layers className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">Configuración de Módulos</h3>
            <p className="text-gray-600">
              Instalación y configuración de módulos especializados según los
              requisitos de tu negocio.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">Análisis de Seguridad</h3>
            <p className="text-gray-600">
              Evaluación continua de vulnerabilidades y riesgos con informes
              detallados en tu dashboard.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">Respuesta a Incidentes</h3>
            <p className="text-gray-600">
              Soporte especializado para detectar y responder a amenazas de
              seguridad en tiempo real.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Custom Module Development */}
      <motion.div
        className="mt-20 bg-gray-50 rounded-2xl p-8 md:p-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Implementación de módulos SIMPLE
            </h3>
            <p className="text-gray-600 mb-6">
              Nuestros especialistas te ayudarán a configurar e implementar los
              módulos que mejor se adapten a las necesidades específicas de tu
              empresa, además de brindarte capacitación para su uso adecuado.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-yellow-400 p-1 rounded-full mr-3 mt-1">
                  <Check className="h-4 w-4 text-black" />
                </div>
                <div>
                  <p className="text-gray-800">
                    Instalación y configuración personalizada
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-yellow-400 p-1 rounded-full mr-3 mt-1">
                  <Check className="h-4 w-4 text-black" />
                </div>
                <div>
                  <p className="text-gray-800">
                    Integración perfecta con tu dashboard
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-yellow-400 p-1 rounded-full mr-3 mt-1">
                  <Check className="h-4 w-4 text-black" />
                </div>
                <div>
                  <p className="text-gray-800">
                    Capacitación de uso para tu equipo
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="bg-black text-white hover:bg-gray-800 border-0 px-8"
            >
              Solicitar implementación
            </Button>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-bold mb-4 text-center">
              Nuestros módulos especializados
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start p-3 border-b border-gray-100">
                <div className="bg-yellow-100 p-2 rounded-full mr-4">
                  <Shield className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h5 className="font-semibold">Simple Evalúa</h5>
                  <p className="text-sm text-gray-600">
                    Diagnóstico del estado actual de ciberseguridad y plan de
                    mejora personalizado
                  </p>
                </div>
              </li>

              <li className="flex items-start p-3 border-b border-gray-100">
                <div className="bg-yellow-100 p-2 rounded-full mr-4">
                  <Bell className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h5 className="font-semibold">Simple Breach + Simple Scan</h5>
                  <p className="text-sm text-gray-600">
                    Monitoreo de datos filtrados y escaneo de vulnerabilidades
                    en sitios web y aplicaciones
                  </p>
                </div>
              </li>

              <li className="flex items-start p-3">
                <div className="bg-yellow-100 p-2 rounded-full mr-4">
                  <Database className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h5 className="font-semibold">Simple API</h5>
                  <p className="text-sm text-gray-600">
                    Análisis especializado de seguridad en APIs, ideal para
                    empresas fintech y de servicios digitales
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div
        className="mt-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nuestro equipo de especialistas cuentan con amplia experiencia y
            certificaciones de seguridad para implementar soluciones efectivas
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 border border-gray-200 rounded-xl">
            <h3 className="text-xl font-bold mb-2">Flexibilidad total</h3>
            <p className="text-gray-600">
              Servicios a medida para las necesidades específicas de tu empresa,
              sin compromisos a largo plazo
            </p>
          </div>
          <div className="bg-white p-6 border border-gray-200 rounded-xl">
            <h3 className="text-xl font-bold mb-2">Experiencia comprobada</h3>
            <p className="text-gray-600">
              Especialistas con más de 10 años de experiencia en ciberseguridad
              y certificaciones reconocidas
            </p>
          </div>
          <div className="bg-white p-6 border border-gray-200 rounded-xl">
            <h3 className="text-xl font-bold mb-2">Implementación rápida</h3>
            <p className="text-gray-600">
              Configuración de tu dashboard y módulos en tiempo récord para que
              puedas empezar a proteger tu empresa de inmediato
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
