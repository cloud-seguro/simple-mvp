import * as React from "react";
import { UserInfo } from "../evaluations/types";
import type { Category } from "../evaluations/types";

export interface ResultsEmailProps {
  userInfo: UserInfo;
  evaluationId: string;
  baseUrl: string;
  score: number;
  maxScore: number;
  maturityLevel: string;
  maturityDescription: string;
  categories: Category[];
  recommendations?: Array<{
    text: string;
    score: number;
    maxScore: number;
    recommendation: string;
    category: string;
    selectedOption?: string;
  }>;
  evaluationType?: string;
}

export const ResultsEmail: React.FC<Readonly<ResultsEmailProps>> = ({
  userInfo,
  evaluationId,
  baseUrl,
  score,
  maxScore,
  maturityLevel,
  maturityDescription,
  categories,
  recommendations = [],
  evaluationType,
}) => {
  // Calculate percentage for the progress bar from actual scores
  const overallPercentage =
    maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  // Get color based on the actual score and evaluation type (not percentage)
  const getScoreColor = (
    actualScore: number,
    maxPossible: number,
    type: string
  ) => {
    const percentage = maxPossible > 0 ? (actualScore / maxPossible) * 100 : 0;

    if (type === "INITIAL") {
      if (percentage <= 20) return "#FF4136"; // Red
      if (percentage <= 40) return "#FF851B"; // Orange
      if (percentage <= 60) return "#FFDC00"; // Yellow
      if (percentage <= 80) return "#2ECC40"; // Green
      return "#0074D9"; // Blue
    } else {
      if (percentage <= 20) return "#FF4136"; // Red
      if (percentage <= 40) return "#FF851B"; // Orange
      if (percentage <= 60) return "#FFDC00"; // Yellow
      if (percentage <= 80) return "#2ECC40"; // Green
      return "#0074D9"; // Blue
    }
  };

  const getScoreBgColor = (
    actualScore: number,
    maxPossible: number,
    type: string
  ) => {
    const percentage = maxPossible > 0 ? (actualScore / maxPossible) * 100 : 0;

    if (type === "INITIAL") {
      if (percentage <= 20) return "#FFEEEE"; // Light Red
      if (percentage <= 40) return "#FFF5EE"; // Light Orange
      if (percentage <= 60) return "#FFFCEE"; // Light Yellow
      if (percentage <= 80) return "#F0FFF0"; // Light Green
      return "#F0F8FF"; // Light Blue
    } else {
      if (percentage <= 20) return "#FFEEEE"; // Light Red
      if (percentage <= 40) return "#FFF5EE"; // Light Orange
      if (percentage <= 60) return "#FFFCEE"; // Light Yellow
      if (percentage <= 80) return "#F0FFF0"; // Light Green
      return "#F0F8FF"; // Light Blue
    }
  };

  const getScoreEmoji = (
    actualScore: number,
    maxPossible: number,
    type: string
  ) => {
    const percentage = maxPossible > 0 ? (actualScore / maxPossible) * 100 : 0;

    if (type === "INITIAL") {
      if (percentage <= 20) return "🔴";
      if (percentage <= 40) return "🟠";
      if (percentage <= 60) return "🟡";
      if (percentage <= 80) return "🟢";
      return "🔵";
    } else {
      if (percentage <= 20) return "🔴";
      if (percentage <= 40) return "🟠";
      if (percentage <= 60) return "🟡";
      if (percentage <= 80) return "🟢";
      return "🔵";
    }
  };

  const scoreColor = getScoreColor(
    score,
    maxScore,
    evaluationType || "ADVANCED"
  );

  // Group recommendations by category for organization
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Calculate scores by category
  const categoryMaturityLevels = categories.map(({ name, score, maxScore }) => {
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    return {
      category: name,
      total: score,
      max: maxScore,
      percentage,
    };
  });

  return (
    <table
      cellPadding="0"
      cellSpacing="0"
      border={0}
      width="100%"
      style={{
        fontFamily: "Arial, sans-serif",
        width: "100%",
        margin: "0",
        padding: "0",
        backgroundColor: "#F5F5F7",
      }}
    >
      <tr>
        <td align="center">
          <table
            cellPadding="0"
            cellSpacing="0"
            border={0}
            width="100%"
            style={{
              maxWidth: "600px",
              width: "100%",
              margin: "0 auto",
            }}
          >
            {/* Header */}
            <tr>
              <td
                style={{
                  backgroundColor: "#FFD700",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <h1 style={{ color: "#000000", margin: "0" }}>
                  Evaluación de Ciberseguridad
                </h1>
              </td>
            </tr>

            <tr>
              <td style={{ padding: "20px" }}>
                <h2>Hola {userInfo.firstName},</h2>

                <p>
                  A continuación encontrará los resultados detallados de su
                  evaluación de ciberseguridad.
                </p>

                {/* Overall Score Card */}
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  border={0}
                  width="100%"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    width: "100%",
                    marginBottom: "25px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <tr>
                    <td style={{ padding: "20px" }}>
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        width="100%"
                      >
                        <tr>
                          <td
                            style={{
                              paddingBottom: "20px",
                            }}
                          >
                            <table
                              cellPadding="0"
                              cellSpacing="0"
                              border={0}
                              width="100%"
                            >
                              <tr>
                                <td width="70%" valign="top">
                                  <h3
                                    style={{
                                      fontSize: "24px",
                                      marginBottom: "5px",
                                      marginTop: "0",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Puntuación General
                                  </h3>
                                  <p style={{ margin: "0", color: "#666" }}>
                                    {maturityLevel}: {maturityDescription}
                                  </p>
                                </td>
                                <td
                                  width="30%"
                                  align="right"
                                  valign="top"
                                  style={{
                                    fontSize: "28px",
                                    fontWeight: "bold",
                                    color: scoreColor,
                                  }}
                                >
                                  {overallPercentage}%
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {/* Progress bar */}
                            <table
                              cellPadding="0"
                              cellSpacing="0"
                              border={0}
                              width="100%"
                              style={{
                                backgroundColor: "#e0e0e0",
                                borderRadius: "10px",
                                height: "20px",
                                overflow: "hidden",
                              }}
                            >
                              <tr>
                                <td
                                  width={`${overallPercentage}%`}
                                  height="20"
                                  style={{
                                    fontSize: "0",
                                    lineHeight: "0",
                                    backgroundColor: scoreColor,
                                  }}
                                >
                                  &nbsp;
                                </td>
                                <td
                                  width={`${100 - overallPercentage}%`}
                                  height="20"
                                  style={{
                                    fontSize: "0",
                                    lineHeight: "0",
                                    backgroundColor: "#e0e0e0",
                                  }}
                                >
                                  &nbsp;
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                {/* Maturity Level Card */}
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  border={0}
                  width="100%"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    width: "100%",
                    marginBottom: "25px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <tr>
                    <td style={{ padding: "20px" }}>
                      <h3
                        style={{
                          fontSize: "20px",
                          marginTop: "0",
                          marginBottom: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        Nivel de Madurez Actual
                      </h3>
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        width="100%"
                        style={{
                          borderRadius: "8px",
                          border: `1px solid ${scoreColor}`,
                        }}
                      >
                        <tr>
                          <td style={{ padding: "15px" }}>
                            <p
                              style={{
                                color: scoreColor,
                                fontWeight: "500",
                                margin: "0",
                              }}
                            >
                              {maturityDescription}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                {/* Category Breakdown */}
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  border={0}
                  width="100%"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    width: "100%",
                    marginBottom: "25px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <tr>
                    <td style={{ padding: "25px" }}>
                      <h3
                        style={{
                          fontSize: "20px",
                          marginTop: "0",
                          marginBottom: "25px",
                          fontWeight: "bold",
                        }}
                      >
                        Desglose por Categoría y Recomendaciones
                      </h3>

                      {/* Category by category */}
                      {categoryMaturityLevels.map(
                        ({ category, total, max, percentage }) => {
                          const categoryColor = getScoreColor(
                            total,
                            max,
                            evaluationType || "ADVANCED"
                          );
                          const categoryEmoji = getScoreEmoji(
                            total,
                            max,
                            evaluationType || "ADVANCED"
                          );
                          const categoryRecommendations =
                            recommendations.filter(
                              (rec) => rec.category === category
                            );

                          return (
                            <table
                              key={category}
                              cellPadding="0"
                              cellSpacing="0"
                              border={0}
                              width="100%"
                              style={{
                                marginBottom: "30px",
                              }}
                            >
                              {/* Category heading */}
                              <tr>
                                <td style={{ paddingBottom: "10px" }}>
                                  <table
                                    cellPadding="0"
                                    cellSpacing="0"
                                    border={0}
                                    width="100%"
                                  >
                                    <tr>
                                      <td
                                        width="70%"
                                        style={{
                                          color: categoryColor,
                                          fontWeight: "600",
                                          fontSize: "18px",
                                        }}
                                      >
                                        {category} {categoryEmoji}
                                      </td>
                                      <td
                                        width="30%"
                                        align="right"
                                        style={{
                                          fontSize: "14px",
                                          fontWeight: "500",
                                          color: "#666",
                                        }}
                                      >
                                        {total}/{max} ({percentage}%)
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>

                              {/* Progress bar for category */}
                              <tr>
                                <td style={{ paddingBottom: "15px" }}>
                                  <table
                                    cellPadding="0"
                                    cellSpacing="0"
                                    border={0}
                                    width="100%"
                                    style={{
                                      backgroundColor: "#e0e0e0",
                                      borderRadius: "8px",
                                      height: "8px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <tr>
                                      <td
                                        width={`${percentage}%`}
                                        height="8"
                                        style={{
                                          fontSize: "0",
                                          lineHeight: "0",
                                          backgroundColor: categoryColor,
                                        }}
                                      >
                                        &nbsp;
                                      </td>
                                      <td
                                        width={`${100 - percentage}%`}
                                        height="8"
                                        style={{
                                          fontSize: "0",
                                          lineHeight: "0",
                                          backgroundColor: "#e0e0e0",
                                        }}
                                      >
                                        &nbsp;
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>

                              {/* Questions in this category */}
                              <tr>
                                <td
                                  style={{
                                    paddingLeft: "10px",
                                    borderLeft: "2px solid #ddd",
                                    marginLeft: "5px",
                                  }}
                                >
                                  {categoryRecommendations.map((rec, index) => {
                                    const questionPercentage = Math.round(
                                      (rec.score / rec.maxScore) * 100
                                    );
                                    const questionColor = getScoreColor(
                                      rec.score,
                                      rec.maxScore,
                                      evaluationType || "ADVANCED"
                                    );
                                    const questionBgColor = getScoreBgColor(
                                      rec.score,
                                      rec.maxScore,
                                      evaluationType || "ADVANCED"
                                    );

                                    return (
                                      <table
                                        key={index}
                                        cellPadding="0"
                                        cellSpacing="0"
                                        border={0}
                                        width="100%"
                                        style={{
                                          backgroundColor: "#f5f5f5",
                                          borderRadius: "8px",
                                          marginBottom: "15px",
                                          border: "1px solid #e0e0e0",
                                        }}
                                      >
                                        <tr>
                                          <td style={{ padding: "15px" }}>
                                            {/* Question header with score */}
                                            <table
                                              cellPadding="0"
                                              cellSpacing="0"
                                              border={0}
                                              width="100%"
                                              style={{ marginBottom: "10px" }}
                                            >
                                              <tr>
                                                <td width="70%" valign="top">
                                                  <p
                                                    style={{
                                                      fontWeight: "500",
                                                      fontSize: "15px",
                                                      color: "#333",
                                                      margin: "0 0 5px 0",
                                                    }}
                                                  >
                                                    {rec.text}
                                                  </p>
                                                  <p
                                                    style={{
                                                      fontSize: "13px",
                                                      color: "#666",
                                                      margin: "0",
                                                    }}
                                                  >
                                                    Respuesta:{" "}
                                                    {rec.selectedOption}
                                                  </p>
                                                </td>
                                                <td
                                                  width="30%"
                                                  align="right"
                                                  valign="top"
                                                >
                                                  <div
                                                    style={{
                                                      fontSize: "14px",
                                                      fontWeight: "500",
                                                      color: questionColor,
                                                    }}
                                                  >
                                                    {rec.score}/{rec.maxScore}
                                                  </div>
                                                  <div
                                                    style={{
                                                      fontSize: "12px",
                                                      color: "#666",
                                                    }}
                                                  >
                                                    {questionPercentage}%
                                                  </div>
                                                </td>
                                              </tr>
                                            </table>

                                            {/* Progress bar for question */}
                                            <table
                                              cellPadding="0"
                                              cellSpacing="0"
                                              border={0}
                                              width="100%"
                                              style={{
                                                backgroundColor: "#e0e0e0",
                                                borderRadius: "4px",
                                                height: "6px",
                                                marginBottom: "10px",
                                                overflow: "hidden",
                                              }}
                                            >
                                              <tr>
                                                <td
                                                  width={`${questionPercentage}%`}
                                                  height="6"
                                                  style={{
                                                    fontSize: "0",
                                                    lineHeight: "0",
                                                    backgroundColor:
                                                      questionColor,
                                                  }}
                                                >
                                                  &nbsp;
                                                </td>
                                                <td
                                                  width={`${100 - questionPercentage}%`}
                                                  height="6"
                                                  style={{
                                                    fontSize: "0",
                                                    lineHeight: "0",
                                                    backgroundColor: "#e0e0e0",
                                                  }}
                                                >
                                                  &nbsp;
                                                </td>
                                              </tr>
                                            </table>

                                            {/* Recommendation */}
                                            <table
                                              cellPadding="0"
                                              cellSpacing="0"
                                              border={0}
                                              width="100%"
                                              style={{
                                                marginTop: "10px",
                                                backgroundColor:
                                                  questionBgColor,
                                                borderTop: "1px solid #e0e0e0",
                                                borderRadius: "0 0 8px 8px",
                                              }}
                                            >
                                              <tr>
                                                <td style={{ padding: "10px" }}>
                                                  <p
                                                    style={{
                                                      fontSize: "13px",
                                                      fontWeight: "500",
                                                      color: "#444",
                                                      margin: "0",
                                                    }}
                                                  >
                                                    <span
                                                      style={{
                                                        display: "inline-block",
                                                        width: "8px",
                                                        height: "8px",
                                                        borderRadius: "50%",
                                                        backgroundColor:
                                                          questionColor,
                                                        marginRight: "8px",
                                                      }}
                                                    >
                                                      &nbsp;
                                                    </span>
                                                    <strong>
                                                      Recomendación:
                                                    </strong>{" "}
                                                    {rec.recommendation}
                                                  </p>
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                    );
                                  })}
                                </td>
                              </tr>
                            </table>
                          );
                        }
                      )}
                    </td>
                  </tr>
                </table>

                {/* Call to Action - Different for Initial vs Advanced evaluations */}
                {evaluationType === "INITIAL" ? (
                  // Subscription CTA for Initial Evaluations
                  <table
                    cellPadding="0"
                    cellSpacing="0"
                    border={0}
                    width="100%"
                    style={{
                      width: "100%",
                      backgroundColor: "#FFD700",
                      color: "#000000",
                      borderRadius: "12px",
                      marginBottom: "20px",
                      border: "2px solid #FFA500",
                    }}
                  >
                    <tr>
                      <td style={{ padding: "25px" }}>
                        <h3
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            margin: "0 0 15px 0",
                            textAlign: "center",
                          }}
                        >
                          🚀 ¡Desbloquea el análisis completo de tu
                          ciberseguridad!
                        </h3>
                        <p
                          style={{
                            margin: "0 0 20px 0",
                            textAlign: "center",
                            fontSize: "16px",
                          }}
                        >
                          Has completado la evaluación básica. Para obtener un
                          diagnóstico profesional y acceso a herramientas
                          avanzadas, suscríbete al <strong>Plan Basic</strong>.
                        </p>

                        {/* Features Grid */}
                        <table
                          cellPadding="0"
                          cellSpacing="0"
                          border={0}
                          width="100%"
                          style={{ marginBottom: "20px" }}
                        >
                          <tr>
                            <td width="50%" style={{ padding: "5px" }}>
                              <table
                                cellPadding="0"
                                cellSpacing="0"
                                border={0}
                                style={{
                                  backgroundColor: "rgba(0,0,0,0.1)",
                                  borderRadius: "8px",
                                  width: "100%",
                                }}
                              >
                                <tr>
                                  <td
                                    style={{
                                      padding: "10px",
                                      fontSize: "14px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    ✅ Evaluación especializada (25 preguntas)
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td width="50%" style={{ padding: "5px" }}>
                              <table
                                cellPadding="0"
                                cellSpacing="0"
                                border={0}
                                style={{
                                  backgroundColor: "rgba(0,0,0,0.1)",
                                  borderRadius: "8px",
                                  width: "100%",
                                }}
                              >
                                <tr>
                                  <td
                                    style={{
                                      padding: "10px",
                                      fontSize: "14px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    ✅ Dashboard interactivo con comparativas
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td width="50%" style={{ padding: "5px" }}>
                              <table
                                cellPadding="0"
                                cellSpacing="0"
                                border={0}
                                style={{
                                  backgroundColor: "rgba(0,0,0,0.1)",
                                  borderRadius: "8px",
                                  width: "100%",
                                }}
                              >
                                <tr>
                                  <td
                                    style={{
                                      padding: "10px",
                                      fontSize: "14px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    ✅ Simple Breach (10 consultas/mes)
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td width="50%" style={{ padding: "5px" }}>
                              <table
                                cellPadding="0"
                                cellSpacing="0"
                                border={0}
                                style={{
                                  backgroundColor: "rgba(0,0,0,0.1)",
                                  borderRadius: "8px",
                                  width: "100%",
                                }}
                              >
                                <tr>
                                  <td
                                    style={{
                                      padding: "10px",
                                      fontSize: "14px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    ✅ Acceso a Simple Contrata
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>

                        {/* Pricing and CTA */}
                        <table
                          cellPadding="0"
                          cellSpacing="0"
                          border={0}
                          width="100%"
                          style={{ textAlign: "center" }}
                        >
                          <tr>
                            <td style={{ paddingBottom: "15px" }}>
                              <div
                                style={{
                                  fontSize: "24px",
                                  fontWeight: "bold",
                                  marginBottom: "5px",
                                }}
                              >
                                Solo $30 USD/mes
                              </div>
                              <div style={{ fontSize: "14px", opacity: "0.8" }}>
                                Cancela cuando quieras • Sin compromisos
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <table
                                cellPadding="0"
                                cellSpacing="0"
                                border={0}
                                style={{ margin: "0 auto" }}
                              >
                                <tr>
                                  <td
                                    style={{
                                      backgroundColor: "#000000",
                                      color: "#ffffff",
                                      padding: "15px 30px",
                                      borderRadius: "25px",
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    <a
                                      href={`${baseUrl}/pricing`}
                                      style={{
                                        color: "#ffffff",
                                        textDecoration: "none",
                                        display: "inline-block",
                                      }}
                                    >
                                      🚀 Suscríbete al Plan Basic
                                    </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                ) : (
                  // Original CTA for Advanced Evaluations
                  <table
                    cellPadding="0"
                    cellSpacing="0"
                    border={0}
                    width="100%"
                    style={{
                      width: "100%",
                      backgroundColor:
                        overallPercentage <= 20
                          ? "#FF4136"
                          : overallPercentage <= 40
                            ? "#FF851B"
                            : overallPercentage <= 60
                              ? "#FFDC00"
                              : overallPercentage <= 80
                                ? "#2ECC40"
                                : "#0074D9",
                      color: "white",
                      borderRadius: "12px",
                      marginBottom: "20px",
                    }}
                  >
                    <tr>
                      <td style={{ padding: "20px" }}>
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            margin: "0 0 10px 0",
                          }}
                        >
                          ¡Mejora tu nivel de ciberseguridad ahora!
                        </h3>
                        <p style={{ margin: "0 0 15px 0" }}>
                          Nuestros especialistas pueden ayudarte a implementar
                          las medidas necesarias para proteger tu organización
                          de amenazas cibernéticas.
                        </p>
                        <table
                          cellPadding="0"
                          cellSpacing="0"
                          border={0}
                          width="100%"
                          style={{ marginBottom: "10px" }}
                        >
                          <tr>
                            <td>
                              <table
                                cellPadding="0"
                                cellSpacing="0"
                                border={0}
                                style={{
                                  display: "inline-block",
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                  backgroundColor: "rgba(255,255,255,0.2)",
                                  borderRadius: "20px",
                                }}
                              >
                                <tr>
                                  <td
                                    style={{
                                      padding: "5px 12px",
                                      fontSize: "13px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    Asesoría personalizada
                                  </td>
                                </tr>
                              </table>
                              <table
                                cellPadding="0"
                                cellSpacing="0"
                                border={0}
                                style={{
                                  display: "inline-block",
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                  backgroundColor: "rgba(255,255,255,0.2)",
                                  borderRadius: "20px",
                                }}
                              >
                                <tr>
                                  <td
                                    style={{
                                      padding: "5px 12px",
                                      fontSize: "13px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    Implementación de controles
                                  </td>
                                </tr>
                              </table>
                              <table
                                cellPadding="0"
                                cellSpacing="0"
                                border={0}
                                style={{
                                  display: "inline-block",
                                  marginBottom: "10px",
                                  backgroundColor: "rgba(255,255,255,0.2)",
                                  borderRadius: "20px",
                                }}
                              >
                                <tr>
                                  <td
                                    style={{
                                      padding: "5px 12px",
                                      fontSize: "13px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    Análisis de vulnerabilidades
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                )}

                {/* Link to full results */}
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  border={0}
                  width="100%"
                  style={{
                    width: "100%",
                    marginTop: "30px",
                    paddingTop: "20px",
                    borderTop: "1px solid #ddd",
                    textAlign: "center",
                  }}
                >
                  <tr>
                    <td style={{ paddingBottom: "15px" }}>
                      Para una experiencia completa y mayor interactividad con
                      sus resultados, visite:
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        style={{
                          margin: "0 auto",
                        }}
                      >
                        <tr>
                          <td
                            style={{
                              backgroundColor: "#000000",
                              color: "#ffffff",
                              padding: "12px 24px",
                              borderRadius: "24px",
                              fontSize: "16px",
                              fontWeight: "bold",
                            }}
                          >
                            <a
                              href={`${baseUrl}/results/${evaluationId}`}
                              style={{
                                color: "#ffffff",
                                textDecoration: "none",
                                display: "inline-block",
                              }}
                            >
                              Ver Informe Completo
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                style={{
                  backgroundColor: "#f1f1f1",
                  padding: "15px",
                  textAlign: "center",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                <p style={{ margin: "0" }}>
                  Este es un correo electrónico automático. Por favor no
                  responda a este mensaje.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  );
};
