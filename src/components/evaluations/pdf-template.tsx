"use client";

import Image from "next/image";
import type { QuizData, UserInfo } from "./types";

interface PDFTemplateProps {
  evaluationId: string;
  score: number;
  maxScore: number;
  maturityDescription: string;
  maturityLevelNumber: number;
  categories: Array<{
    name: string;
    score: number;
    maxScore: number;
  }>;
  recommendations: Array<{
    score: number;
    maxScore: number;
    text: string;
    selectedOption: string;
    category: string;
    recommendation: string;
  }>;
  quizData: QuizData;
  userInfo: UserInfo;
}

export function PDFTemplate({
  evaluationId,
  score,
  maxScore,
  maturityDescription,
  maturityLevelNumber,
  categories,
  recommendations,
  quizData,
  userInfo,
}: PDFTemplateProps) {
  // Calculate percentage for coloring
  const displayPercentage = Math.min(
    Math.round(
      (score / (quizData.id === "evaluacion-avanzada" ? 100 : maxScore)) * 100
    ),
    100
  );

  // Helper function for color classes based on percentage
  const getColorClass = (percentage: number) => {
    if (percentage <= 20)
      return { color: "#dc2626", bg: "#dc2626", light: "#fee2e2", emoji: "🔴" };
    if (percentage <= 40)
      return { color: "#ea580c", bg: "#ea580c", light: "#ffedd5", emoji: "🟠" };
    if (percentage <= 60)
      return { color: "#ca8a04", bg: "#ca8a04", light: "#fef9c3", emoji: "🟡" };
    if (percentage <= 80)
      return { color: "#16a34a", bg: "#16a34a", light: "#dcfce7", emoji: "🟢" };
    return { color: "#2563eb", bg: "#2563eb", light: "#dbeafe", emoji: "🔵" };
  };

  const scoreColor = getColorClass(displayPercentage);

  // Group recommendations by category
  const recommendationsByCategory = recommendations.reduce(
    (acc, rec) => {
      if (!acc[rec.category]) {
        acc[rec.category] = [];
      }
      acc[rec.category].push(rec);
      return acc;
    },
    {} as Record<string, typeof recommendations>
  );

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* FIRST PAGE - OVERVIEW */}
      <div style={{ padding: "20px", pageBreakAfter: "always" }}>
        {/* Header */}
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #eaeaea",
            paddingBottom: "10px",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "5px",
              marginTop: 0,
            }}
          >
            Evaluación de Ciberseguridad
          </h1>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ color: "#666", margin: 0 }}>ID: {evaluationId}</p>
            <p style={{ color: "#666", margin: 0 }}>
              {userInfo.firstName} {userInfo.lastName}
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
            gap: "15px",
          }}
        >
          <div
            style={{
              width: "50%",
              padding: "15px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              border: "1px solid #eaeaea",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#666",
                marginTop: 0,
                marginBottom: "5px",
              }}
            >
              Puntuación Total
            </p>
            <p
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: scoreColor.color,
                margin: "5px 0",
              }}
            >
              {quizData.id === "evaluacion-inicial"
                ? Math.min(score, maxScore)
                : score}
              /{quizData.id === "evaluacion-avanzada" ? 100 : maxScore}
            </p>
            <p style={{ fontSize: "14px", color: "#666", margin: "5px 0" }}>
              {displayPercentage}% de madurez
            </p>
          </div>

          <div
            style={{
              width: "50%",
              padding: "15px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              border: "1px solid #eaeaea",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#666",
                marginTop: 0,
                marginBottom: "5px",
              }}
            >
              Nivel de Madurez
            </p>
            <p
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: scoreColor.color,
                margin: "5px 0",
              }}
            >
              <span style={{ marginRight: "8px" }}>{scoreColor.emoji}</span>
              <span>Nivel {maturityLevelNumber}</span>
            </p>
            <p style={{ fontSize: "14px", color: "#666", margin: "5px 0" }}>
              {maturityDescription}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: "15px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}
          >
            <span
              style={{
                color: scoreColor.color,
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              PROGRESO
            </span>
            <span
              style={{
                color: scoreColor.color,
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              {displayPercentage}%
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: "10px",
              backgroundColor: scoreColor.light,
              borderRadius: "9999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${displayPercentage}%`,
                height: "100%",
                backgroundColor: scoreColor.bg,
                borderRadius: "9999px",
              }}
            ></div>
          </div>
        </div>

        {/* Maturity Description Box */}
        <div
          style={{
            padding: "15px",
            border: `1px solid ${scoreColor.color}`,
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          <p
            style={{
              color: scoreColor.color,
              fontWeight: "500",
              marginTop: 0,
              marginBottom: "10px",
            }}
          >
            {maturityDescription}
          </p>

          <div style={{ paddingTop: "10px", borderTop: "1px solid #eaeaea" }}>
            <p style={{ fontSize: "14px", color: "#4b5563", margin: 0 }}>
              {quizData.id === "evaluacion-inicial"
                ? maturityLevelNumber <= 1
                  ? "No hay un enfoque estructurado de ciberseguridad. Los controles son inexistentes o informales. Se requiere establecer procesos y medidas de seguridad básicas."
                  : maturityLevelNumber <= 2
                    ? "Existen algunos controles de ciberseguridad, pero no están formalizados ni aplicados de manera consistente. Aún se depende de acciones individuales y no hay gestión centralizada."
                    : maturityLevelNumber <= 3
                      ? "La organización cuenta con políticas y procesos documentados de ciberseguridad. Hay roles definidos, pero aún falta optimizar la aplicación y supervisión de estos controles."
                      : maturityLevelNumber <= 4
                        ? "La ciberseguridad se gestiona activamente con métricas, auditorías y monitoreo continuo. Se aplican mejoras constantes, pero hay oportunidades de optimización en procesos críticos."
                        : "La ciberseguridad es robusta y completamente integrada en la organización. Se han automatizado procesos, gestionado proactivamente los riesgos y optimizado los controles."
                : maturityLevelNumber <= 1
                  ? "La seguridad se maneja de forma reactiva. No hay procesos documentados ni una estructura clara para gestionar riesgos y proteger la información."
                  : maturityLevelNumber <= 2
                    ? "Existen controles básicos, pero su aplicación no es uniforme. La seguridad depende de esfuerzos individuales y acciones aisladas en lugar de procesos bien definidos."
                    : maturityLevelNumber <= 3
                      ? "Los procesos de ciberseguridad están estructurados y alineados con estándares como ISO 27001, NIST y CIS. Se han implementado controles en la nube, gestión de vulnerabilidades y auditorías."
                      : maturityLevelNumber <= 4
                        ? "La ciberseguridad es gestionada con métricas, auditorías y monitoreo activo. Se han implementado SOC, SIEM, análisis de amenazas y simulaciones de incidentes."
                        : "Ciberseguridad avanzada con procesos automatizados y monitoreo en tiempo real. Se han adoptado estrategias como Zero Trust, detección de amenazas con IA y seguridad en la nube."}
            </p>
          </div>
        </div>

        {/* Categories Overview */}
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "10px",
            marginTop: "25px",
          }}
        >
          Resumen por Categorías
        </h2>
        <div style={{ marginBottom: "15px" }}>
          {categories.map(({ name, score, maxScore }) => {
            const percentage = Math.round((score / maxScore) * 100);
            const catColor = getColorClass(percentage);

            return (
              <div key={name} style={{ marginBottom: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "2px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      margin: "2px 0",
                    }}
                  >
                    {name} {catColor.emoji}
                  </p>
                  <span
                    style={{ fontSize: "14px", color: "#4b5563", margin: 0 }}
                  >
                    {percentage}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    backgroundColor: catColor.light,
                    borderRadius: "9999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: "100%",
                      backgroundColor: catColor.bg,
                      borderRadius: "9999px",
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Page Instructions */}
        <div
          style={{
            marginTop: "30px",
            backgroundColor: "#f9f9f9",
            padding: "10px",
            borderRadius: "8px",
            border: "1px dashed #ccc",
          }}
        >
          <p style={{ fontSize: "14px", color: "#4b5563", margin: 0 }}>
            <strong>A continuación:</strong> Se presenta el detalle de cada
            categoría con sus respectivas recomendaciones. Cada página contiene
            la información específica de una categoría y las acciones
            recomendadas.
          </p>
        </div>
      </div>

      {/* CATEGORY DETAIL PAGES - One page per category */}
      {categories.map(({ name, score, maxScore }, categoryIndex) => {
        const percentage = Math.round((score / maxScore) * 100);
        const catColor = getColorClass(percentage);
        const categoryRecs = recommendationsByCategory[name] || [];
        const isLastCategory = categoryIndex === categories.length - 1;

        return (
          <div
            key={name}
            style={{
              padding: "20px",
              pageBreakAfter: isLastCategory ? "auto" : "always",
            }}
          >
            <div
              style={{
                borderBottom: "1px solid #eaeaea",
                marginBottom: "15px",
                paddingBottom: "5px",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#333",
                  marginTop: 0,
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: catColor.bg,
                    marginRight: "8px",
                  }}
                ></span>
                Categoría: {name}
              </h2>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    backgroundColor: catColor.light,
                    color: catColor.color,
                    fontWeight: "500",
                  }}
                >
                  {score}/{maxScore} puntos
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    backgroundColor: catColor.light,
                    color: catColor.color,
                    fontWeight: "500",
                  }}
                >
                  {percentage}% completado
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    backgroundColor: catColor.light,
                    color: catColor.color,
                    fontWeight: "500",
                  }}
                >
                  {percentage <= 20
                    ? "Nivel Crítico"
                    : percentage <= 40
                      ? "Nivel Básico"
                      : percentage <= 60
                        ? "Nivel Intermedio"
                        : percentage <= 80
                          ? "Nivel Bueno"
                          : "Nivel Excelente"}
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "8px",
                  backgroundColor: catColor.light,
                  borderRadius: "9999px",
                  overflow: "hidden",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: "100%",
                    backgroundColor: catColor.bg,
                    borderRadius: "9999px",
                  }}
                ></div>
              </div>
            </div>

            {/* Category Recommendations */}
            <h3
              style={{
                fontSize: "16px",
                color: "#333",
                marginBottom: "10px",
                marginTop: "20px",
              }}
            >
              Acciones Recomendadas
            </h3>

            {categoryRecs.length > 0 ? (
              <div>
                {categoryRecs.map((rec) => {
                  const questionPercentage = Math.round(
                    (rec.score / rec.maxScore) * 100
                  );
                  const recColor = getColorClass(questionPercentage);

                  return (
                    <div
                      key={`${rec.category}-${rec.text}`}
                      style={{
                        marginBottom: "15px",
                        padding: "12px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        border: "1px solid #eaeaea",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "5px",
                        }}
                      >
                        <div style={{ flex: "1" }}>
                          <p
                            style={{
                              fontWeight: "500",
                              color: "#1f2937",
                              fontSize: "14px",
                              margin: 0,
                            }}
                          >
                            {rec.text}
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#4b5563",
                              margin: "4px 0 0 0",
                            }}
                          >
                            Respuesta: {rec.selectedOption}
                          </p>
                        </div>
                        <div style={{ textAlign: "right", marginLeft: "16px" }}>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              color: recColor.color,
                            }}
                          >
                            {rec.score}/{rec.maxScore}
                          </div>
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>
                            {questionPercentage}%
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          width: "100%",
                          height: "4px",
                          backgroundColor: "#e5e7eb",
                          borderRadius: "9999px",
                          overflow: "hidden",
                          margin: "8px 0",
                        }}
                      >
                        <div
                          style={{
                            width: `${questionPercentage}%`,
                            height: "100%",
                            backgroundColor: recColor.bg,
                            borderRadius: "9999px",
                          }}
                        ></div>
                      </div>

                      <div
                        style={{
                          marginTop: "8px",
                          paddingTop: "8px",
                          borderTop: "1px solid #e5e7eb",
                          backgroundColor: recColor.light,
                          borderBottomLeftRadius: "6px",
                          borderBottomRightRadius: "6px",
                          padding: "8px",
                          marginLeft: "-12px",
                          marginRight: "-12px",
                          marginBottom: "-12px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#4b5563",
                            display: "flex",
                            alignItems: "center",
                            margin: 0,
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              marginRight: "8px",
                              backgroundColor: recColor.bg,
                            }}
                          ></span>
                          <span style={{ color: recColor.color }}>
                            {questionPercentage <= 40
                              ? "Acción prioritaria"
                              : questionPercentage <= 70
                                ? "Acción recomendada"
                                : "Mantener"}
                          </span>
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            lineHeight: "1.4",
                            marginTop: "4px",
                            marginBottom: 0,
                            fontWeight:
                              questionPercentage <= 40 ? "500" : "normal",
                          }}
                        >
                          {rec.recommendation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: "#666", fontStyle: "italic" }}>
                No hay recomendaciones específicas para esta categoría.
              </p>
            )}
          </div>
        );
      })}

      {/* DISCLAIMER PAGE */}
      <div style={{ padding: "20px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "15px",
          }}
        >
          Aviso Legal y Recomendaciones Finales
        </h2>

        <div
          style={{
            padding: "15px",
            border: "1px solid #eaeaea",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              color: "#333",
              marginTop: 0,
              marginBottom: "10px",
            }}
          >
            Limitación de Responsabilidad
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "#4b5563",
              lineHeight: "1.4",
              margin: 0,
            }}
          >
            Este informe representa una evaluación puntual basada en la
            información proporcionada al momento de su realización. Las
            recomendaciones son orientativas y su implementación debe adaptarse
            a las características específicas de su organización. Ciberseguridad
            Simple no se responsabiliza por vulnerabilidades o riesgos no
            identificados en esta evaluación.
          </p>
        </div>

        <div
          style={{
            padding: "15px",
            border: "1px solid #eaeaea",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              color: "#333",
              marginTop: 0,
              marginBottom: "10px",
            }}
          >
            Próximos Pasos Recomendados
          </h3>
          <ol
            style={{
              fontSize: "13px",
              color: "#4b5563",
              lineHeight: "1.4",
              paddingLeft: "20px",
              margin: 0,
            }}
          >
            <li style={{ marginBottom: "8px" }}>
              Priorice la implementación de acciones en las categorías con
              puntuaciones más bajas.
            </li>
            <li style={{ marginBottom: "8px" }}>
              Establezca un plan de acción con plazos y responsables para cada
              recomendación.
            </li>
            <li style={{ marginBottom: "8px" }}>
              Considere realizar una reevaluación en 3-6 meses para medir el
              progreso.
            </li>
            <li style={{ marginBottom: "8px" }}>
              Consulte con especialistas para las áreas que requieran
              conocimientos técnicos específicos.
            </li>
            <li>
              Mantenga actualizadas sus políticas y controles de seguridad según
              evolucionen las amenazas.
            </li>
          </ol>
        </div>

        {/* Contact Information */}
        <div
          style={{
            marginTop: "30px",
            textAlign: "center",
            borderTop: "1px solid #eaeaea",
            paddingTop: "15px",
          }}
        >
          <Image
            src="https://ciberseguridadsimple.com/logo.png"
            alt="Ciberseguridad Simple Logo"
            width={150}
            height={50}
            style={{ marginBottom: "10px" }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <p style={{ fontSize: "14px", fontWeight: "bold", margin: "5px 0" }}>
            Ciberseguridad Simple
          </p>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: "5px 0" }}>
            contacto@ciberseguridadsimple.com | www.ciberseguridadsimple.com
          </p>
          <p style={{ fontSize: "11px", color: "#9ca3af", margin: "5px 0" }}>
            Informe generado el{" "}
            {new Date().toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
