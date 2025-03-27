"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SpecialistsRecommendations } from "@/components/evaluations/specialists-recommendations";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";
import { SimpleHeader } from "@/components/ui/simple-header";
import { cn } from "@/lib/utils";

function ScheduleContent() {
  const searchParams = useSearchParams();
  const maturityLevel = parseInt(searchParams.get("level") || "1");
  const categories = searchParams.get("categories")?.split(",") || [];
  const evaluationId = searchParams.get("evaluationId");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="p-8 bg-white border-b shadow-sm">
        <SimpleHeader className="text-primary" />
      </header>

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Agenda con Especialistas en Ciberseguridad
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center mb-6">
              <CalendarDays className="h-10 w-10 text-primary mr-4" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Consulta Personalizada
                </h2>
                <p className="text-gray-600">
                  Recibe asesoramiento experto para mejorar tu seguridad
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-gray-700">
                Nuestros especialistas te ayudarán a:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Identificar vulnerabilidades críticas en tu entorno</li>
                <li>Desarrollar un plan de acción personalizado</li>
                <li>Priorizar inversiones en ciberseguridad</li>
                <li>
                  Implementar controles efectivos según estándares
                  internacionales
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> La primera consulta de 30 minutos es
                gratuita. Después de esta sesión, podrás decidir si deseas
                contratar servicios adicionales.
              </p>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              Agendar Consulta Gratuita
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start mb-6">
              <Users className="h-8 w-8 text-primary mr-4 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Especialistas Recomendados
                </h2>
                <p className="text-gray-600">
                  Basado en tu evaluación, te recomendamos estos especialistas
                </p>
              </div>
            </div>

            <SpecialistsRecommendations
              maturityLevel={maturityLevel}
              categories={categories}
            />
          </div>
        </div>
      </main>

      <footer className="p-4 border-t bg-white">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          SIMPLE © {new Date().getFullYear()} - Haciendo la ciberseguridad
          accesible
        </div>
      </footer>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense fallback={<SecurityLoadingScreen message="Cargando..." />}>
      <ScheduleContent />
    </Suspense>
  );
}
