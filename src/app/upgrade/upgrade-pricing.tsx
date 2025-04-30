"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield, Database, Bell, Search, Layers, Check, X } from "lucide-react";

export default function UpgradePricing() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-medium mb-3">
            Protege tu empresa
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Planes de suscripción
          </h2>
          <p className="text-lg max-w-3xl mx-auto">
            Obtén acceso a nuestro dashboard intuitivo y módulos especializados
            para mantener tu empresa segura contra amenazas cibernéticas
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Free Card */}
          <div className="bg-white rounded-xl p-8 flex flex-col h-full border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Plan Básico</h3>
              <div className="bg-yellow-400 text-black rounded-full px-4 py-1 text-sm font-medium">
                Gratis
              </div>
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
                <div className="flex items-start">
                  <div className="bg-yellow-400 p-2 rounded-full mr-3 mt-1">
                    <Shield className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h4 className="font-medium">Evaluación inicial</h4>
                    <p className="text-gray-600">
                      Accede a nuestra evaluación de seguridad básica con 15
                      preguntas
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-yellow-400 p-2 rounded-full mr-3 mt-1">
                    <Database className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h4 className="font-medium">Dashboard básico</h4>
                    <p className="text-gray-600">
                      Acceso a visualización básica de tu nivel de seguridad
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              disabled
              className="w-full py-6 bg-black text-white hover:bg-gray-800"
            >
              Plan Actual
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              No requiere tarjeta de crédito
            </p>
          </div>

          {/* Premium Card */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-8 flex flex-col h-full relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-2xl font-bold text-white">Plan Premium</h3>
              <div className="bg-black text-white rounded-full px-4 py-1 text-sm font-medium">
                Recomendado
              </div>
            </div>

            <div className="mb-6 relative z-10">
              <span className="text-4xl font-bold text-white">$25</span>
              <span className="text-white/80 ml-2">/mes</span>
            </div>

            <div className="mb-8 flex-grow relative z-10">
              <p className="text-white/90 mb-4">
                Protección completa con todas las funciones y módulos para
                mantener tu empresa segura.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-3 mt-1">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      Evaluación avanzada
                    </h4>
                    <p className="text-white/80">
                      Evaluación completa con 25+ preguntas y análisis detallado
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-3 mt-1">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      Dashboard completo
                    </h4>
                    <p className="text-white/80">
                      Acceso a todas las funciones y visualizaciones del
                      dashboard
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-3 mt-1">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      Alertas de seguridad
                    </h4>
                    <p className="text-white/80">
                      Notificaciones en tiempo real sobre vulnerabilidades
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/api/upgrade/premium">
              <Button className="w-full py-6 bg-black text-white hover:bg-gray-800 relative z-10">
                <span className="relative z-10">Actualizar Ahora</span>
              </Button>
            </Link>

            <p className="text-center text-sm text-white/70 mt-4 relative z-10">
              Cancelación en cualquier momento
            </p>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden">
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
                    Dashboard interactivo
                  </td>
                  <td className="text-center py-4 px-2 md:px-4">Básico</td>
                  <td className="text-center py-4 px-2 md:px-4 bg-white">
                    Avanzado
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-2 md:px-4 font-medium">
                    Módulos adicionales
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
