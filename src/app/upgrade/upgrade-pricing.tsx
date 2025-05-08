"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Shield,
  Database,
  Bell,
  Check,
  X,
  BarChart4,
  FileText,
  Users,
  Layers,
} from "lucide-react";

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
              <h3 className="text-2xl font-bold">Plan Gratis</h3>
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

          {/* Basic Plan Card */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-8 flex flex-col h-full relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-2xl font-bold text-white">Plan Basic</h3>
              <div className="bg-black text-white rounded-full px-4 py-1 text-sm font-medium">
                Recomendado
              </div>
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
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-3 mt-1">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      Evaluación especializada
                    </h4>
                    <p className="text-white/80">
                      25 preguntas clave alineadas a estándares ISO 27001 y NIST
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-3 mt-1">
                    <BarChart4 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Comparación</h4>
                    <p className="text-white/80">
                      Compara tu nivel de madurez y revisa tus avances
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-3 mt-1">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      Acceso al dashboard
                    </h4>
                    <p className="text-white/80">
                      Visualiza tu nivel de madurez y haz seguimiento
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-3 mt-1">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Simple Breach</h4>
                    <p className="text-white/80">
                      10 consultas mensuales para verificar brechas de datos
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-3 mt-1">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      Exporta tu informe
                    </h4>
                    <p className="text-white/80">
                      Descarga y comparte tu informe de evaluación en PDF
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
              Ideal para startups y empresas en crecimiento
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
                  <td className="text-center py-4 px-2 md:px-4">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
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
              </tbody>
            </table>
          </div>
        </div>

        {/* Modules Section */}
        <div className="max-w-5xl mx-auto mt-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">
              🧩 Nuestros módulos adicionales
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Personaliza tu experiencia con módulos especializados que se
              integran perfectamente con tu dashboard
            </p>
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
        </div>
      </div>
    </div>
  );
}
