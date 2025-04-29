
// Determine maturity level based on quiz type and score
export function getMaturityLevel(
  evaluationType: string,
  score: number
): {
  level: string;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
  advice?: string;
} {
  if (evaluationType === "evaluacion-inicial") {
    // Initial evaluation (max 45 points)
    if (score <= 9) {
      return {
        level: "Nivel 1",
        emoji: "🔴",
        color: "text-red-600",
        bgColor: "bg-red-100",
        description: "Nivel Inicial / Ad-hoc",
        advice:
          "Establezca controles básicos y documente sus políticas de seguridad.",
      };
    }
    if (score <= 19) {
      return {
        level: "Nivel 2",
        emoji: "🟠",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        description: "Nivel Repetible pero intuitivo",
        advice:
          "Formalice los procesos existentes y mejore la consistencia de sus controles.",
      };
    }
    if (score <= 29) {
      return {
        level: "Nivel 3",
        emoji: "🟡",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        description: "Nivel Definido",
        advice:
          "Optimice la aplicación de sus controles y mejore la supervisión.",
      };
    }
    if (score <= 39) {
      return {
        level: "Nivel 4",
        emoji: "🟢",
        color: "text-green-600",
        bgColor: "bg-green-100",
        description: "Nivel Gestionado y Medido",
        advice:
          "Implemente monitoreo avanzado y automatice sus procesos de seguridad.",
      };
    }
    return {
      level: "Nivel 5",
      emoji: "🔵",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Nivel Optimizado",
      advice:
        "Mantenga su nivel y evolucione según nuevas amenazas emergentes.",
    };
  } else {
    // Advanced evaluation (max 100 points instead of 75)
    if (score <= 20) {
      return {
        level: "Nivel 1",
        emoji: "🔴",
        color: "text-red-600",
        bgColor: "bg-red-100",
        description: "Nivel Inicial / Ad-hoc",
        advice: "Implemente controles básicos alineados con ISO 27001 y NIST.",
      };
    }
    if (score <= 45) {
      return {
        level: "Nivel 2",
        emoji: "🟠",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        description: "Nivel Repetible pero intuitivo",
        advice:
          "Estandarice y documente las políticas, asegurando su aplicación consistente.",
      };
    }
    if (score <= 68) {
      return {
        level: "Nivel 3",
        emoji: "🟡",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        description: "Nivel Definido",
        advice:
          "Mejore la medición de controles con monitoreo continuo y métricas.",
      };
    }
    if (score <= 88) {
      return {
        level: "Nivel 4",
        emoji: "🟢",
        color: "text-green-600",
        bgColor: "bg-green-100",
        description: "Nivel Gestionado y Medido",
        advice:
          "Refuerce la inteligencia de amenazas y automatice respuestas a incidentes.",
      };
    }
    return {
      level: "Nivel 5",
      emoji: "🔵",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Nivel Optimizado",
      advice:
        "Mantenga la innovación y estrategias avanzadas ante amenazas emergentes.",
    };
  }
}
