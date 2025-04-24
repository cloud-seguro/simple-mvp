import { type NextRequest, NextResponse } from "next/server";
import { getEvaluationById } from "@/lib/evaluation-utils";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Evaluation ID is required" },
        { status: 400 }
      );
    }

    // Get the evaluation
    const evaluation = await getEvaluationById(id);

    if (!evaluation) {
      return NextResponse.json(
        { error: "Evaluation not found" },
        { status: 404 }
      );
    }

    // Check if the user is authenticated
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Extract all evaluation data including metadata
    const {
      id: evalId,
      type,
      title,
      score,
      createdAt,
      completedAt,
      answers,
      metadata,
      profile,
      profileId,
    } = evaluation as EvaluationData;

    // Calculate the total score from answers if not already calculated
    let calculatedScore = score || 0;
    const totalPossibleScore = type === "INITIAL" ? 45 : 75; // 45 for initial evaluations, 75 for advanced

    if (answers && typeof answers === "object") {
      // Convert answers object values to numbers and calculate total
      const summedScore = Object.values(
        answers as Record<string, unknown>
      ).reduce(
        (sum: number, val: unknown) =>
          sum + (typeof val === "number" ? val : Number(val) || 0),
        0
      ) as number;
      calculatedScore = summedScore;
    }

    // Get maturity level information based on evaluation type and score
    const maturityInfo =
      type === "INITIAL"
        ? getInitialMaturityLevel(calculatedScore)
        : getAdvancedMaturityLevel(calculatedScore);

    // Calculate categories from answers
    const categories: CategoryData[] = [];

    // Fetch quiz data to get question information
    const quizId =
      type === "INITIAL" ? "evaluacion-inicial" : "evaluacion-avanzada";

    try {
      // Import getQuizData dynamically to avoid circular dependencies
      const { getQuizData } = await import("@/lib/quiz-data");
      const quizData = getQuizData(quizId);

      if (quizData && answers && typeof answers === "object") {
        // Group questions by category
        const categoryMap: Record<string, { total: number; max: number }> = {};

        for (const question of quizData.questions) {
          const category = question.category || "General";
          const questionId = question.id;
          const answerValue =
            Number((answers as Record<string, unknown>)[questionId]) || 0;
          const maxValue = Math.max(
            ...question.options.map((o) =>
              typeof o.value === "number" ? o.value : 0
            )
          );

          if (!categoryMap[category]) {
            categoryMap[category] = { total: 0, max: 0 };
          }

          categoryMap[category].total += answerValue;
          categoryMap[category].max += maxValue;
        }

        // Convert category map to array format
        Object.entries(categoryMap).forEach(([name, { total, max }]) => {
          categories.push({
            name,
            score: total,
            maxScore: max,
          });
        });
      }
    } catch (error) {
      console.error("Error calculating categories:", error);
      // Continue with empty categories if there's an error
    }

    // Generate recommendations for each question
    const recommendations: Array<{
      score: number;
      maxScore: number;
      text: string;
      selectedOption: string;
      category: string;
      recommendation: string;
    }> = [];

    try {
      const { getQuizData } = await import("@/lib/quiz-data");
      const quizData = getQuizData(quizId);

      if (quizData && answers && typeof answers === "object") {
        for (const question of quizData.questions) {
          const category = question.category || "General";
          const questionId = question.id;
          const questionScore =
            Number((answers as Record<string, unknown>)[questionId]) || 0;
          const maxScore = Math.max(
            ...question.options.map((o) =>
              typeof o.value === "number" ? o.value : 0
            )
          );

          // Find the selected option
          const selectedOption = question.options.find(
            (o) => o.value === questionScore
          );

          if (selectedOption) {
            const percentage = (questionScore / maxScore) * 100;
            let recommendation = "";

            if (quizId === "evaluacion-inicial") {
              if (percentage <= 20) {
                recommendation =
                  "Requiere atención inmediata. Establezca controles básicos y políticas fundamentales.";
              } else if (percentage <= 40) {
                recommendation =
                  "Necesita mejoras significativas. Formalice y documente los procesos existentes.";
              } else if (percentage <= 60) {
                recommendation =
                  "En desarrollo. Optimice la aplicación de controles y mejore la supervisión.";
              } else if (percentage <= 80) {
                recommendation =
                  "Bien establecido. Continue monitoreando y mejorando los procesos.";
              } else {
                recommendation =
                  "Excelente. Mantenga el nivel y actualice según nuevas amenazas.";
              }
            } else {
              if (percentage <= 20) {
                recommendation =
                  "Crítico: Implemente controles básicos siguiendo ISO 27001 y NIST.";
              } else if (percentage <= 40) {
                recommendation =
                  "Importante: Estandarice procesos y documente políticas de seguridad.";
              } else if (percentage <= 60) {
                recommendation =
                  "Moderado: Mejore la medición y optimización de controles existentes.";
              } else if (percentage <= 80) {
                recommendation =
                  "Bueno: Implemente monitoreo avanzado y automatización de respuestas.";
              } else {
                recommendation =
                  "Excelente: Mantenga la innovación y preparación ante amenazas emergentes.";
              }
            }

            recommendations.push({
              score: questionScore,
              maxScore,
              text: question.text,
              selectedOption:
                selectedOption.text ||
                selectedOption.label ||
                `Opción ${questionScore}`,
              category,
              recommendation,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      // Continue with empty recommendations if there's an error
    }

    // Calculate the weakest categories for specialist recommendations
    const categoryPercentages = categories.map(({ name, score, maxScore }) => ({
      category: name,
      percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
    }));

    // Get the two lowest scoring categories (areas that need the most help)
    const weakestCategories = [...categoryPercentages]
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 2)
      .map((item) => item.category);

    // Prepare the response data
    const responseData = {
      id: evalId,
      score: calculatedScore,
      maxScore: totalPossibleScore,
      maturityLevel: maturityInfo.level,
      maturityDescription: maturityInfo.description,
      categories,
      recommendations,
      weakestCategories,
      maturityLevelNumber: parseInt(
        maturityInfo.level.split("–")[0].replace("Nivel ", "").trim(),
        10
      ),
      // Include original evaluation data
      evaluation: {
        id: evalId,
        type,
        title,
        score: calculatedScore,
        createdAt,
        completedAt,
        answers,
        metadata,
        profile: {
          firstName: profile.firstName || "Usuario",
          company: profile.company || "Empresa",
        },
      },
    };

    // If the user is not authenticated, return the public data
    if (!session?.user) {
      return NextResponse.json(responseData);
    }

    // Get the user's profile
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("userId", session.user.id)
      .single();

    // If the user is authenticated but not the owner of the evaluation,
    // only return basic information unless they are a SUPERADMIN
    if (
      userProfile &&
      userProfile.id !== profileId &&
      userProfile.role !== "SUPERADMIN"
    ) {
      return NextResponse.json(responseData);
    }

    // If the user is the owner or a SUPERADMIN, return more detailed information
    return NextResponse.json({
      ...responseData,
      evaluation: {
        ...evaluation,
        calculatedScore,
        maturityInfo,
      },
    });
  } catch (error) {
    console.error("Error fetching evaluation:", error);
    return NextResponse.json(
      { error: "Failed to fetch evaluation" },
      { status: 500 }
    );
  }
}
