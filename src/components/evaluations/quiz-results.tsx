"use client";

import { Button } from "@/components/ui/button";
import type { QuizData, QuizResults as QuizResultsType } from "./types";
import Link from "next/link";
import { SpecialistsRecommendations } from "./specialists-recommendations";
import { CalendarCheck, ArrowRight } from "lucide-react";

interface QuizResultsProps {
  quizData: QuizData;
  results: QuizResultsType;
  onRestart: () => void;
  evaluationId: string;
}

interface MaturityLevelInfo {
  level: number;
  title: string;
  description: string;
  advice: string;
  actionText: string;
}

const getMaturityLevelInfo = (
  percentage: number,
  evaluationType: string = "ADVANCED"
): MaturityLevelInfo => {
  // Convert percentage to actual score based on evaluation type
  const score =
    evaluationType === "INITIAL"
      ? Math.round((percentage / 100) * 45) // Initial eval (45 points)
      : Math.round((percentage / 100) * 100); // Advanced eval (100 points)

  if (evaluationType === "INITIAL") {
    // Initial evaluation scoring
    if (score <= 9) {
      return {
        level: 1,
        title: "Nivel 1 - Inicial / Ad-hoc",
        description:
          "No hay un enfoque estructurado de ciberseguridad. Los controles son inexistentes o informales. Se requiere establecer procesos y medidas de seguridad básicas.",
        advice:
          "Trabaja en establecer una estrategia inicial de seguridad, enfocada en definir políticas, roles y procesos básicos para proteger la información.",
        actionText: "Comenzar Estrategia",
      };
    } else if (score <= 19) {
      return {
        level: 2,
        title: "Nivel 2 - Repetible pero intuitivo",
        description:
          "Existen algunos controles de ciberseguridad, pero no están formalizados ni aplicados de manera consistente. Aún se depende de acciones individuales y no hay gestión centralizada.",
        advice:
          "Estandariza y documenta las políticas de seguridad, asegurando que sean aplicadas en toda la organización.",
        actionText: "Estandarizar Procesos",
      };
    } else if (score <= 29) {
      return {
        level: 3,
        title: "Nivel 3 - Definido",
        description:
          "La organización cuenta con políticas y procesos documentados de ciberseguridad. Hay roles definidos, pero aún falta optimizar la aplicación y supervisión de estos controles.",
        advice:
          "Profundiza en la medición y optimización de los controles, con el uso de monitoreo continuo y métricas de seguridad.",
        actionText: "Optimizar Controles",
      };
    } else if (score <= 39) {
      return {
        level: 4,
        title: "Nivel 4 - Gestionado y Medido",
        description:
          "La ciberseguridad se gestiona activamente con métricas, auditorías y monitoreo continuo. Se aplican mejoras constantes, pero hay oportunidades de optimización en procesos críticos.",
        advice:
          "Asegura la mejora continua en la gestión de incidentes y la resiliencia organizacional.",
        actionText: "Fortalecer Resiliencia",
      };
    } else {
      return {
        level: 5,
        title: "Nivel 5 - Optimizado",
        description:
          "La ciberseguridad es robusta y completamente integrada en la organización. Se han automatizado procesos, gestionado proactivamente los riesgos y optimizado los controles.",
        advice:
          "Continúa innovando y evolucionando tu estrategia de seguridad para mantener el ritmo de las amenazas emergentes.",
        actionText: "Mantener Excelencia",
      };
    }
  } else {
    // Advanced evaluation scoring
    if (score <= 20) {
      return {
        level: 1,
        title: "Nivel 1 - Inicial / Ad-hoc",
        description:
          "La seguridad se maneja de forma reactiva. No hay procesos documentados ni una estructura clara para gestionar riesgos y proteger la información.",
        advice:
          "Trabaja en establecer una estrategia inicial de seguridad, enfocada en definir políticas, roles y procesos básicos para proteger la información. ISO 27001 y NIST recomiendan empezar con la identificación de activos y riesgos.",
        actionText: "Comenzar Estrategia",
      };
    } else if (score <= 45) {
      return {
        level: 2,
        title: "Nivel 2 - Repetible pero intuitivo",
        description:
          "Existen controles básicos, pero su aplicación no es uniforme. La seguridad depende de esfuerzos individuales y acciones aisladas en lugar de procesos bien definidos.",
        advice:
          "Estandariza y documenta las políticas de seguridad, asegurando que sean aplicadas en toda la organización. Trabaja en la gestión de riesgos y en el uso de controles técnicos recomendados por CIS Controls y NIST CSF.",
        actionText: "Estandarizar Procesos",
      };
    } else if (score <= 70) {
      return {
        level: 3,
        title: "Nivel 3 - Definido",
        description:
          "Los procesos de ciberseguridad están estructurados y alineados con estándares como ISO 27001, NIST y CIS. Se han implementado controles en la nube, gestión de vulnerabilidades y auditorías.",
        advice:
          "Profundiza en la medición y optimización de los controles, con el uso de monitoreo continuo y métricas de seguridad. Explora herramientas de Zero Trust, segmentación de red y pruebas de seguridad en aplicaciones (DevSecOps, OWASP ASVS).",
        actionText: "Optimizar Controles",
      };
    } else if (score <= 90) {
      return {
        level: 4,
        title: "Nivel 4 - Gestionado y Medido",
        description:
          "La ciberseguridad es gestionada con métricas, auditorías y monitoreo activo. Se han implementado SOC, SIEM, análisis de amenazas y simulaciones de incidentes (Red Team, Blue Team).",
        advice:
          "Asegura la mejora continua en la gestión de incidentes y la resiliencia organizacional. Refuerza el uso de inteligencia de amenazas (OSINT, Dark Web Monitoring) y la automatización de respuestas a incidentes (SOAR, XDR).",
        actionText: "Fortalecer Resiliencia",
      };
    } else {
      return {
        level: 5,
        title: "Nivel 5 - Optimizado",
        description:
          "Ciberseguridad avanzada con procesos automatizados y monitoreo en tiempo real. Se han adoptado estrategias como Zero Trust, detección de amenazas con IA y seguridad en la nube con cumplimiento de marcos como AWS Well-Architected, Google Cloud Security y Azure Security Center.",
        advice:
          "Sigue fortaleciendo la estrategia de seguridad con ciberinteligencia y automatización. Evalúa constantemente nuevas tecnologías, mejora la gestión de crisis y resiliencia y optimiza los procesos de respuesta a incidentes con IA.",
        actionText: "Innovar Seguridad",
      };
    }
  }
};

const getColorIntensity = (percentage: number): string => {
  // We'll keep the same hue but adjust opacity based on percentage
  const opacity = percentage / 100;
  return `rgba(255, 133, 72, ${opacity})`;
};

export function QuizResults({
  quizData,
  results,
  onRestart,
  evaluationId,
}: QuizResultsProps) {
  // Calculate scores by category
  const categoryScores: Record<string, { total: number; max: number }> = {};

  for (const question of quizData.questions) {
    const category = question.category || "General";
    const score = results[question.id] || 0;
    const maxScore = Math.max(...question.options.map((o) => o.value));

    if (!categoryScores[category]) {
      categoryScores[category] = { total: 0, max: 0 };
    }

    categoryScores[category].total += score;
    categoryScores[category].max += maxScore;
  }

  // Calculate overall score
  const overallScore = Object.values(categoryScores).reduce(
    (sum, { total }) => sum + total,
    0
  );

  const maxPossibleScore = Object.values(categoryScores).reduce(
    (sum, { max }) => sum + max,
    0
  );

  const overallPercentage = Math.round((overallScore / maxPossibleScore) * 100);
  const maturityInfo = getMaturityLevelInfo(
    overallPercentage,
    quizData.id === "evaluacion-inicial" ? "INITIAL" : "ADVANCED"
  );

  // Get top categories (for specialists recommendations)
  const categoryPercentages = Object.entries(categoryScores).map(
    ([category, { total, max }]) => ({
      category,
      percentage: Math.round((total / max) * 100),
    })
  );

  // Get the two lowest scoring categories (areas that need the most help)
  const weakestCategories = [...categoryPercentages]
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 2)
    .map((item) => item.category);

  // Create the URL for the scheduling page with evaluation data
  const scheduleUrl = `/schedule?level=${maturityInfo.level}&categories=${weakestCategories.join(",")}&evaluationId=${evaluationId}`;

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="p-4 transition-colors duration-300"
        style={{ backgroundColor: getColorIntensity(100) }}
      >
        <div className="flex justify-start">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-bold text-white">SIMPLE</h1>
          </Link>
        </div>
      </header>

      <main className="flex-grow p-8">
        <div className="max-w-2xl mx-auto">
          {/* New Call to Action Banner at the top */}
          <div className="bg-gradient-to-r from-[#FF8548] to-[#FF9D6B] p-6 rounded-xl mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center text-white">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <CalendarCheck className="h-16 w-16" />
              </div>
              <div className="flex-grow text-center md:text-left mb-4 md:mb-0">
                <h2 className="text-xl font-bold mb-2">
                  ¿Necesitas ayuda profesional?
                </h2>
                <p>
                  Agenda una consulta con nuestros especialistas certificados en
                  ciberseguridad para implementar soluciones personalizadas.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link href={scheduleUrl}>
                  <Button className="bg-white text-[#FF8548] hover:bg-gray-100 font-semibold flex items-center">
                    Agendar Consulta <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-6">
            Resultados de {quizData.title}
          </h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              Puntuación Total: {overallScore}/{maxPossibleScore} (
              {overallPercentage}%)
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
              <div
                className="h-4 rounded-full transition-colors duration-300"
                style={{
                  width: `${overallPercentage}%`,
                  backgroundColor: getColorIntensity(overallPercentage),
                }}
              />
            </div>

            {/* Maturity Level Information */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
              <h3
                className="text-xl font-bold mb-2 transition-colors duration-300"
                style={{ color: getColorIntensity(100) }}
              >
                {maturityInfo.title}
              </h3>
              <p className="text-gray-600 mb-4">{maturityInfo.description}</p>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold mb-2">Consejo:</h4>
                <p className="text-gray-700 mb-4">{maturityInfo.advice}</p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-block text-white font-semibold px-6 py-3 rounded-full transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: getColorIntensity(100),
                    }}
                  >
                    {maturityInfo.actionText}
                  </Link>
                  <Link href={scheduleUrl}>
                    <Button
                      variant="outline"
                      className="px-6 py-3 rounded-full"
                    >
                      Agendar con Especialista
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-4">
              Desglose por Categoría:
            </h3>
            <div className="space-y-4 mb-8">
              {Object.entries(categoryScores).map(
                ([category, { total, max }]) => {
                  const percentage = Math.round((total / max) * 100);
                  return (
                    <div key={category}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{category}</span>
                        <span>
                          {total}/{max} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-colors duration-300"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: getColorIntensity(percentage),
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* Specialists Recommendations */}
            <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <SpecialistsRecommendations
                maturityLevel={maturityInfo.level}
                categories={weakestCategories}
              />

              {/* Additional CTA after recommendations */}
              <div className="mt-6 text-center">
                <Link href={scheduleUrl}>
                  <Button className="bg-[#FF8548] text-white hover:bg-[#E07038]">
                    Agendar Consultoria con Especialistas
                  </Button>
                </Link>
                <p className="mt-2 text-sm text-gray-500">
                  Primera consulta de 30 minutos sin costo
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={onRestart}
            className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-2 mt-8"
          >
            Realizar otra evaluación
          </Button>
        </div>
      </main>

      <footer className="p-4 border-t">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          SIMPLE © {new Date().getFullYear()} - Haciendo la ciberseguridad
          accesible
        </div>
      </footer>
    </div>
  );
}
