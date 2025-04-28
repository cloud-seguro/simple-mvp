import { type NextRequest, NextResponse } from "next/server";
import { getEvaluationById } from "@/lib/evaluation-utils";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
  withApiAuth,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/middleware/api-authorization";
import { canAccessEvaluation } from "@/lib/auth/permission-checks";
import { prisma } from "@/lib/prisma";

interface EvaluationData {
  id: string;
  type: string;
  title: string;
  score: number | null;
  createdAt: Date;
  completedAt: Date | null;
  answers: Record<string, unknown>;
  metadata: Record<string, unknown>;
  profile: {
    firstName: string | null;
    company: string | null;
    [key: string]: unknown;
  };
  profileId: string;
}

interface CategoryData {
  name: string;
  score: number;
  maxScore: number;
}

// Function to get maturity level information based on score for initial evaluations
function getInitialMaturityLevel(score: number) {
  if (score <= 9) {
    return {
      level: "Nivel 1 – Inicial / Ad-hoc",
      description:
        "No hay un enfoque estructurado de ciberseguridad. Los controles son inexistentes o informales. Se requiere establecer procesos y medidas de seguridad básicas.",
      color: "red",
      emoji: "🔴",
    };
  }
  if (score <= 19) {
    return {
      level: "Nivel 2 – Repetible pero intuitivo",
      description:
        "Existen algunos controles de ciberseguridad, pero no están formalizados ni aplicados de manera consistente. Aún se depende de acciones individuales y no hay gestión centralizada.",
      color: "orange",
      emoji: "🟠",
    };
  }
  if (score <= 29) {
    return {
      level: "Nivel 3 – Definido",
      description:
        "La organización cuenta con políticas y procesos documentados de ciberseguridad. Hay roles definidos, pero aún falta optimizar la aplicación y supervisión de estos controles.",
      color: "yellow",
      emoji: "🟡",
    };
  }
  if (score <= 39) {
    return {
      level: "Nivel 4 – Gestionado y Medido",
      description:
        "La ciberseguridad se gestiona activamente con métricas, auditorías y monitoreo continuo. Se aplican mejoras constantes, pero hay oportunidades de optimización en procesos críticos.",
      color: "green",
      emoji: "🟢",
    };
  }
  if (score <= 44) {
    return {
      level: "Nivel 5 – Optimizado",
      description:
        "La ciberseguridad está en un nivel avanzado con controles implementados y revisados periódicamente. Se han adoptado procesos de mejora continua, aunque aún pueden fortalecerse ciertos aspectos estratégicos.",
      color: "blue",
      emoji: "🔵",
    };
  }
  // score === 45
  return {
    level: "Nivel 5 – Óptimo",
    description:
      "La ciberseguridad es robusta y completamente integrada en la organización. Se han automatizado procesos, gestionado proactivamente los riesgos y optimizado los controles. Sin embargo, siempre hay margen de evolución ante nuevas amenazas.",
    color: "blue",
    emoji: "🔵",
  };
}

// Function to get maturity level information based on score for advanced evaluations
function getAdvancedMaturityLevel(score: number) {
  if (score <= 15) {
    return {
      level: "Nivel 1 – Inicial / Ad-hoc",
      description:
        "La seguridad se maneja de forma reactiva. No hay procesos documentados ni una estructura clara para gestionar riesgos y proteger la información.",
      advice:
        "Trabaja en establecer una estrategia inicial de seguridad, enfocada en definir políticas, roles y procesos básicos para proteger la información. ISO 27001 y NIST recomiendan empezar con la identificación de activos y riesgos.",
      color: "red",
      emoji: "🔴",
    };
  }
  if (score <= 34) {
    return {
      level: "Nivel 2 – Repetible pero intuitivo",
      description:
        "Existen controles básicos, pero su aplicación no es uniforme. La seguridad depende de esfuerzos individuales y acciones aisladas en lugar de procesos bien definidos.",
      advice:
        "Estandariza y documenta las políticas de seguridad, asegurando que sean aplicadas en toda la organización. Trabaja en la gestión de riesgos y en el uso de controles técnicos recomendados por CIS Controls y NIST CSF.",
      color: "orange",
      emoji: "🟠",
    };
  }
  if (score <= 51) {
    return {
      level: "Nivel 3 – Definido",
      description:
        "Los procesos de ciberseguridad están estructurados y alineados con estándares como ISO 27001, NIST y CIS. Se han implementado controles en la nube, gestión de vulnerabilidades y auditorías.",
      advice:
        "Profundiza en la medición y optimización de los controles, con el uso de monitoreo continuo y métricas de seguridad. Explora herramientas de Zero Trust, segmentación de red y pruebas de seguridad en aplicaciones (DevSecOps, OWASP ASVS).",
      color: "yellow",
      emoji: "🟡",
    };
  }
  if (score <= 66) {
    return {
      level: "Nivel 4 – Gestionado y Medido",
      description:
        "La ciberseguridad es gestionada con métricas, auditorías y monitoreo activo. Se han implementado SOC, SIEM, análisis de amenazas y simulaciones de incidentes (Red Team, Blue Team).",
      advice:
        "Asegura la mejora continua en la gestión de incidentes y la resiliencia organizacional. Refuerza el uso de inteligencia de amenazas (OSINT, Dark Web Monitoring) y la automatización de respuestas a incidentes (SOAR, XDR).",
      color: "green",
      emoji: "🟢",
    };
  }
  if (score <= 74) {
    return {
      level: "Nivel 5 – Optimizado",
      description:
        "Ciberseguridad avanzada con procesos automatizados y monitoreo en tiempo real. Se han adoptado estrategias como Zero Trust, detección de amenazas con IA y seguridad en la nube con cumplimiento de marcos como AWS Well-Architected, Google Cloud Security y Azure Security Center.",
      advice:
        "Sigue fortaleciendo la estrategia de seguridad con ciberinteligencia y automatización. Evalúa constantemente nuevas tecnologías, mejora la gestión de crisis y resiliencia y optimiza los procesos de respuesta a incidentes con IA.",
      color: "blue",
      emoji: "🔵",
    };
  }
  // score === 75
  return {
    level: "Nivel 5 – Óptimo",
    description:
      "Ciberseguridad completamente integrada en la cultura organizacional. Se han implementado detección de amenazas con IA, automatización total de respuesta a incidentes, monitoreo continuo de la Dark Web y cumplimiento avanzado de seguridad en entornos híbridos y en la nube.",
    advice:
      "Se nota que has trabajado en ciberseguridad y dominas los estándares. Mantén un enfoque en innovación y evolución, asegurando que el equipo y la organización estén preparados para amenazas emergentes. Continúa reforzando la estrategia con simulaciones avanzadas y escenarios de crisis en entornos reales.",
    color: "blue",
    emoji: "🔵",
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withApiAuth(req, async (req, user) => {
    try {
      const evaluationId = params.id;

      // Must be authenticated to access evaluations
      if (!user) {
        return unauthorizedResponse();
      }

      // Check if the user has permission to access this evaluation
      const hasAccess = await canAccessEvaluation(user.id, evaluationId);

      if (!hasAccess) {
        return forbiddenResponse();
      }

      // Get the evaluation
      const evaluation = await prisma.evaluation.findUnique({
        where: { id: evaluationId },
      });

      if (!evaluation) {
        return NextResponse.json(
          { error: "Evaluation not found" },
          { status: 404 }
        );
      }

      // Return the evaluation
      return NextResponse.json({ evaluation });
    } catch (error) {
      console.error("Error in evaluation GET:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withApiAuth(req, async (req, user) => {
    try {
      const evaluationId = params.id;

      // Must be authenticated to update evaluations
      if (!user) {
        return unauthorizedResponse();
      }

      // Check if the user has permission to access this evaluation
      const hasAccess = await canAccessEvaluation(user.id, evaluationId);

      if (!hasAccess) {
        return forbiddenResponse();
      }

      // Parse the request body
      const body = await req.json();

      // Update the evaluation
      const evaluation = await prisma.evaluation.update({
        where: { id: evaluationId },
        data: {
          // Only allow updating certain fields
          // This prevents users from changing fields they shouldn't
          title: body.title,
          answers: body.answers,
          // Don't allow changing profileId or other sensitive fields
        },
      });

      // Return the updated evaluation
      return NextResponse.json({ evaluation });
    } catch (error) {
      console.error("Error in evaluation PATCH:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
