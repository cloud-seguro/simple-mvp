"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Search, Terminal } from "lucide-react";
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
        <span className="inline-block bg-yellow-100 text-black px-4 py-2 rounded-full text-sm font-medium mb-3">
          Equipo de especialistas
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Un equipo de expertos en ciberseguridad a tu disposición
        </h2>
        <p className="text-lg max-w-3xl mx-auto">
          Selecciona la cantidad de horas mensuales según las necesidades de
          seguridad de tu empresa. Nuestros especialistas te ayudarán a proteger
          tus activos digitales.
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
        <div className="bg-yellow-100 text-center py-2 mb-8 font-medium text-black">
          +1233 PROYECTOS ENTREGADOS PARA 142 EMPRESAS EN TODO DEL MUNDO
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
                    <span className="inline-block bg-yellow-100 text-black rounded-full w-5 h-5 flex-shrink-0 mr-2"></span>
                    <span>10 horas de servicio por mes</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-yellow-500 mr-2">✓</span>
                    <span>Evaluación de vulnerabilidades</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-yellow-500 mr-2">✓</span>
                    <span>Configuración básica de seguridad</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-yellow-500 mr-2">✓</span>
                    <span>Soporte por correo electrónico</span>
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
                    <span className="inline-block bg-yellow-100 text-black rounded-full w-5 h-5 flex-shrink-0 mr-2"></span>
                    <span>24 horas de servicio por mes</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-yellow-500 mr-2">✓</span>
                    <span>Análisis completo de vulnerabilidades</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-yellow-500 mr-2">✓</span>
                    <span>Implementación de soluciones</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-yellow-500 mr-2">✓</span>
                    <span>Soporte prioritario</span>
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
                    <span className="inline-block bg-yellow-100 text-black rounded-full w-5 h-5 flex-shrink-0 mr-2"></span>
                    <span>48 horas de servicio por mes</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-yellow-500 mr-2">✓</span>
                    <span>Tests de penetración completos</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-yellow-500 mr-2">✓</span>
                    <span>Respuesta a incidentes 24/7</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-yellow-500 mr-2">✓</span>
                    <span>Consultoría personalizada</span>
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

      {/* Cybersecurity Services */}
      <motion.div
        className="mt-20 grid md:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="bg-yellow-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-yellow-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            Protección de Infraestructura
          </h3>
          <p className="text-gray-600">
            Evaluación y protección de servidores, redes y sistemas críticos de
            tu empresa.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="bg-yellow-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-yellow-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Seguridad de Aplicaciones</h3>
          <p className="text-gray-600">
            Análisis de seguridad de aplicaciones web, móviles y APIs de tu
            negocio.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="bg-yellow-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-yellow-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Monitoreo de Amenazas</h3>
          <p className="text-gray-600">
            Vigilancia continua para detectar y responder a amenazas emergentes
            en tiempo real.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="bg-yellow-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <Terminal className="h-6 w-6 text-yellow-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Consultoría Especializada</h3>
          <p className="text-gray-600">
            Asesoramiento personalizado por expertos en seguridad informática y
            normativa.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-2xl font-bold mb-4">
          ¿Necesitas un plan personalizado?
        </h3>
        <p className="text-lg mb-8 max-w-3xl mx-auto">
          Contáctanos para diseñar un plan que se ajuste exactamente a los
          requerimientos de seguridad de tu empresa.
        </p>
        <Button className="bg-yellow-500 text-black hover:bg-yellow-600 px-8 py-6 text-lg">
          Hablar con un especialista
        </Button>
      </motion.div>
    </div>
  );
}
