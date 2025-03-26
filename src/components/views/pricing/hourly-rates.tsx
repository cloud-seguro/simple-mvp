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
        <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-medium mb-3">
          Monitoreo continuo de seguridad
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Accede a recursos exclusivos con nuestra suscripción mensual
        </h2>
        <p className="text-lg max-w-3xl mx-auto">
          Obtén acceso a un dashboard personalizado para visualizar tus avances
          en ciberseguridad, realizar un análisis continuo de vulnerabilidades y
          tomar mejores decisiones para proteger tu empresa.
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
          MONITORA TU SEGURIDAD EN TIEMPO REAL
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
                    <span>Dashboard personalizado básico</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Monitoreo de correo empresarial</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Evaluación básica de vulnerabilidades</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Alertas de seguridad básicas</span>
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
                    <span>Dashboard avanzado con métricas</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Monitoreo completo de activos digitales</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Análisis continuo de vulnerabilidades</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Alertas en tiempo real</span>
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
                    <span>Dashboard empresarial completo</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Monitoreo de APIs y servicios</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Análisis predictivo de amenazas</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Respuesta automática a incidentes</span>
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
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            Protección de Infraestructura
          </h3>
          <p className="text-gray-600">
            Evaluación y protección de servidores, redes y sistemas críticos de
            tu empresa.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-xl font-bold mb-2">Seguridad de Aplicaciones</h3>
          <p className="text-gray-600">
            Análisis de seguridad de aplicaciones web, móviles y APIs de tu
            negocio.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-xl font-bold mb-2">Monitoreo de Amenazas</h3>
          <p className="text-gray-600">
            Vigilancia continua para detectar y responder a amenazas emergentes
            en tiempo real.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="bg-yellow-400 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <Terminal className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-xl font-bold mb-2">Consultoría Especializada</h3>
          <p className="text-gray-600">
            Asesoramiento personalizado por expertos en seguridad informática y
            cumplimiento normativo.
          </p>
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
            certificaciones de seguridad
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
            <h3 className="text-xl font-bold mb-2">Respuesta inmediata</h3>
            <p className="text-gray-600">
              Tiempo de respuesta garantizado según el plan contratado, con
              soporte prioritario
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
