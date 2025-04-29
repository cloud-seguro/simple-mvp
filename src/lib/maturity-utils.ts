import { MaturityLevel } from "@/components/evaluations/types";

// Determine maturity level based on quiz type and score
export function getMaturityLevel(quizId: string, score: number): MaturityLevel {
  if (quizId === "evaluacion-inicial") {
    // Initial evaluation tiers (max 45 points)
    if (score <= 9) {
      return {
        level: "Nivel 1 – Inicial / Ad-hoc",
        emoji: "🔴",
        color: "text-red-600",
        bgColor: "bg-red-100",
        description:
          "No hay un enfoque estructurado de ciberseguridad. Los controles son inexistentes o informales. Se requiere establecer procesos y medidas de seguridad básicas.",
        advice:
          "Te podemos ayudar a subir este nivel de madurez hacerlo solo toma más tiempo.",
      };
    }
    if (score <= 19) {
      return {
        level: "Nivel 2 – Repetible pero intuitivo",
        emoji: "🟠",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        description:
          "Existen algunos controles de ciberseguridad, pero no están formalizados ni aplicados de manera consistente. Aún se depende de acciones individuales y no hay gestión centralizada.",
        advice:
          "Para validar tu estado de seguridad, Ciberseguridad Simple puede realizar una auditoría y verificación de documentación, controles y riesgos.",
      };
    }
    if (score <= 29) {
      return {
        level: "Nivel 3 – Definido",
        emoji: "🟡",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        description:
          "La organización cuenta con políticas y procesos documentados de ciberseguridad. Hay roles definidos, pero aún falta optimizar la aplicación y supervisión de estos controles.",
        advice:
          "Se recomienda una verificación con Ciberseguridad Simple para revisar documentación, procesos y riesgos clave.",
      };
    }
    if (score <= 39) {
      return {
        level: "Nivel 4 – Gestionado y Medido",
        emoji: "🟢",
        color: "text-green-600",
        bgColor: "bg-green-100",
        description:
          "La ciberseguridad se gestiona activamente con métricas, auditorías y monitoreo continuo. Se aplican mejoras constantes, pero hay oportunidades de optimización en procesos críticos.",
        advice:
          "Se recomienda una verificación con Ciberseguridad Simple para revisar documentación, procesos y riesgos clave.",
      };
    }
    if (score <= 44) {
      return {
        level: "Nivel 5 – Optimizado",
        emoji: "🔵",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        description:
          "La ciberseguridad está en un nivel avanzado con controles implementados y revisados periódicamente. Se han adoptado procesos de mejora continua, aunque aún pueden fortalecerse ciertos aspectos estratégicos.",
        advice:
          "Se recomienda una verificación con Ciberseguridad Simple para evaluar la efectividad de los controles, revisar la documentación de seguridad y validar la gestión de riesgos.",
      };
    }
    return {
      level: "Nivel 5 – Óptimo",
      emoji: "🔵",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description:
        "La ciberseguridad es robusta y completamente integrada en la organización. Se han automatizado procesos, gestionado proactivamente los riesgos y optimizado los controles. Sin embargo, siempre hay margen de evolución ante nuevas amenazas.",
      advice:
        "Para validar tu estado de seguridad, Ciberseguridad Simple puede realizar una auditoría y verificación de documentación, controles y riesgos.",
    };
  }

  // Advanced evaluation tiers (max 75 points)
  if (score <= 15) {
    return {
      level: "Nivel 1 – Inicial / Ad-hoc",
      emoji: "🔴",
      color: "text-red-600",
      bgColor: "bg-red-100",
      description:
        "La seguridad se maneja de forma reactiva. No hay procesos documentados ni una estructura clara para gestionar riesgos y proteger la información.",
      advice:
        "Trabaja en establecer una estrategia inicial de seguridad, enfocada en definir políticas, roles y procesos básicos para proteger la información. ISO 27001 y NIST recomiendan empezar con la identificación de activos y riesgos.",
    };
  }
  if (score <= 34) {
    return {
      level: "Nivel 2 – Repetible pero intuitivo",
      emoji: "🟠",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description:
        "Existen controles básicos, pero su aplicación no es uniforme. La seguridad depende de esfuerzos individuales y acciones aisladas en lugar de procesos bien definidos.",
      advice:
        "Estandariza y documenta las políticas de seguridad, asegurando que sean aplicadas en toda la organización. Trabaja en la gestión de riesgos y en el uso de controles técnicos recomendados por CIS Controls y NIST CSF.",
    };
  }
  if (score <= 51) {
    return {
      level: "Nivel 3 – Definido",
      emoji: "🟡",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      description:
        "Los procesos de ciberseguridad están estructurados y alineados con estándares como ISO 27001, NIST y CIS. Se han implementado controles en la nube, gestión de vulnerabilidades y auditorías.",
      advice:
        "Profundiza en la medición y optimización de los controles, con el uso de monitoreo continuo y métricas de seguridad. Explora herramientas de Zero Trust, segmentación de red y pruebas de seguridad en aplicaciones (DevSecOps, OWASP ASVS).",
    };
  }
  if (score <= 66) {
    return {
      level: "Nivel 4 – Gestionado y Medido",
      emoji: "🟢",
      color: "text-green-600",
      bgColor: "bg-green-100",
      description:
        "La ciberseguridad es gestionada con métricas, auditorías y monitoreo activo. Se han implementado SOC, SIEM, análisis de amenazas y simulaciones de incidentes (Red Team, Blue Team).",
      advice:
        "Asegura la mejora continua en la gestión de incidentes y la resiliencia organizacional. Refuerza el uso de inteligencia de amenazas (OSINT, Dark Web Monitoring) y la automatización de respuestas a incidentes (SOAR, XDR).",
    };
  }
  if (score <= 74) {
    return {
      level: "Nivel 5 – Optimizado",
      emoji: "🔵",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description:
        "Ciberseguridad avanzada con procesos automatizados y monitoreo en tiempo real. Se han adoptado estrategias como Zero Trust, detección de amenazas con IA y seguridad en la nube con cumplimiento de marcos como AWS Well-Architected, Google Cloud Security y Azure Security Center.",
      advice:
        "Sigue fortaleciendo la estrategia de seguridad con ciberinteligencia y automatización. Evalúa constantemente nuevas tecnologías, mejora la gestión de crisis y resiliencia y optimiza los procesos de respuesta a incidentes con IA.",
    };
  }
  return {
    level: "Nivel 5 – Óptimo",
    emoji: "🔵",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description:
      "Ciberseguridad completamente integrada en la cultura organizacional. Se han implementado detección de amenazas con IA, automatización total de respuesta a incidentes, monitoreo continuo de la Dark Web y cumplimiento avanzado de seguridad en entornos híbridos y en la nube.",
    advice:
      "Se nota que has trabajado en ciberseguridad y dominas los estándares. Mantén un enfoque en innovación y evolución, asegurando que el equipo y la organización estén preparados para amenazas emergentes. Continúa reforzando la estrategia con simulaciones avanzadas y escenarios de crisis en entornos reales.",
  };
}
