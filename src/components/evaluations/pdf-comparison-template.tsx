"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { QuizData, UserInfo } from "./types";

interface ComparisonData {
  id: string;
  title: string;
  date: Date;
  answers: Record<string, number>;
  userInfo: UserInfo;
  score: number;
}

interface PDFComparisonTemplateProps {
  firstEvaluation: ComparisonData;
  secondEvaluation: ComparisonData;
  quizData: QuizData;
  evaluationType: "INITIAL" | "ADVANCED";
}

export function PDFComparisonTemplate({
  firstEvaluation,
  secondEvaluation,
  quizData,
  evaluationType,
}: PDFComparisonTemplateProps) {
  // Calculate overall score difference
  const scoreDifference = secondEvaluation.score - firstEvaluation.score;
  const percentageDifference =
    firstEvaluation.score > 0
      ? (scoreDifference / Math.max(0.1, firstEvaluation.score)) * 100
      : 0;

  // Format dates
  const firstDate = format(
    new Date(firstEvaluation.date),
    "d 'de' MMMM 'de' yyyy",
    {
      locale: es,
    }
  );
  const secondDate = format(
    new Date(secondEvaluation.date),
    "d 'de' MMMM 'de' yyyy",
    {
      locale: es,
    }
  );

  // Calculate category scores
  const categoryScores: Record<
    string,
    {
      category: string;
      firstScore: number;
      secondScore: number;
      firstMax: number;
      secondMax: number;
      difference: number;
      percentageDifference: number;
    }
  > = {};

  // Process all questions to calculate category scores
  for (const question of quizData.questions) {
    const category = question.category || "General";
    const firstScore = firstEvaluation.answers[question.id] || 0;
    const secondScore = secondEvaluation.answers[question.id] || 0;
    const maxScore = Math.max(...question.options.map((o) => o.value));

    if (!categoryScores[category]) {
      categoryScores[category] = {
        category,
        firstScore: 0,
        secondScore: 0,
        firstMax: 0,
        secondMax: 0,
        difference: 0,
        percentageDifference: 0,
      };
    }

    categoryScores[category].firstScore += firstScore;
    categoryScores[category].secondScore += secondScore;
    categoryScores[category].firstMax += maxScore;
    categoryScores[category].secondMax += maxScore;
  }

  // Calculate differences for each category
  for (const category of Object.values(categoryScores)) {
    category.difference = category.secondScore - category.firstScore;
    category.percentageDifference =
      category.firstScore > 0
        ? (category.difference / Math.max(0.1, category.firstScore)) * 100
        : 0;
  }

  const getColorByPercentage = (percentage: number) => {
    if (percentage <= 20) return "#dc2626"; // red-600
    if (percentage <= 40) return "#ea580c"; // orange-600
    if (percentage <= 60) return "#ca8a04"; // yellow-600
    if (percentage <= 80) return "#16a34a"; // green-600
    return "#2563eb"; // blue-600
  };

  const getDifferenceColor = (difference: number) => {
    if (difference > 0) return "#16a34a"; // green-600
    if (difference < 0) return "#dc2626"; // red-600
    return "#6b7280"; // gray-500
  };

  const typeName = evaluationType === "INITIAL" ? "Inicial" : "Avanzada";

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        lineHeight: "1.4",
        color: "#374151",
        backgroundColor: "#ffffff",
        padding: "20px",
        maxWidth: "210mm",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "20px",
          marginBottom: "30px",
          pageBreakAfter: "avoid",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#1f2937",
              margin: "0",
            }}
          >
            Comparación de Evaluaciones
          </h1>
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Evaluación {typeName}
          </div>
        </div>
        <p
          style={{
            color: "#6b7280",
            margin: "0",
            fontSize: "14px",
          }}
        >
          Análisis comparativo de madurez en ciberseguridad
        </p>
        <p
          style={{
            color: "#6b7280",
            margin: "5px 0 0 0",
            fontSize: "11px",
          }}
        >
          Generado el{" "}
          {format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
      </div>

      {/* Evaluation Headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px",
          pageBreakInside: "avoid",
        }}
      >
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderLeft: "4px solid #3b82f6",
            borderRadius: "8px",
            padding: "16px",
            backgroundColor: "#f8fafc",
          }}
        >
          <h3
            style={{
              color: "#1e40af",
              fontSize: "16px",
              fontWeight: "bold",
              margin: "0 0 8px 0",
            }}
          >
            Evaluación 1
          </h3>
          <p
            style={{
              color: "#6b7280",
              fontSize: "11px",
              margin: "0 0 12px 0",
            }}
          >
            {firstEvaluation.title}
          </p>
          <div style={{ marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "#6b7280" }}>Fecha: </span>
            <span style={{ fontSize: "11px", fontWeight: "500" }}>
              {firstDate}
            </span>
          </div>
          <div style={{ marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "#6b7280" }}>
              Usuario:{" "}
            </span>
            <span style={{ fontSize: "11px", fontWeight: "500" }}>
              {firstEvaluation.userInfo.firstName}{" "}
              {firstEvaluation.userInfo.lastName}
            </span>
          </div>
          <div
            style={{
              backgroundColor:
                firstEvaluation.score >= 70
                  ? "#dcfce7"
                  : firstEvaluation.score >= 50
                    ? "#fef3c7"
                    : "#fee2e2",
              color:
                firstEvaluation.score >= 70
                  ? "#166534"
                  : firstEvaluation.score >= 50
                    ? "#92400e"
                    : "#991b1b",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: "600",
              display: "inline-block",
            }}
          >
            {Math.round(firstEvaluation.score)}%
          </div>
        </div>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderLeft: "4px solid #10b981",
            borderRadius: "8px",
            padding: "16px",
            backgroundColor: "#f0fdf4",
          }}
        >
          <h3
            style={{
              color: "#047857",
              fontSize: "16px",
              fontWeight: "bold",
              margin: "0 0 8px 0",
            }}
          >
            Evaluación 2
          </h3>
          <p
            style={{
              color: "#6b7280",
              fontSize: "11px",
              margin: "0 0 12px 0",
            }}
          >
            {secondEvaluation.title}
          </p>
          <div style={{ marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "#6b7280" }}>Fecha: </span>
            <span style={{ fontSize: "11px", fontWeight: "500" }}>
              {secondDate}
            </span>
          </div>
          <div style={{ marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "#6b7280" }}>
              Usuario:{" "}
            </span>
            <span style={{ fontSize: "11px", fontWeight: "500" }}>
              {secondEvaluation.userInfo.firstName}{" "}
              {secondEvaluation.userInfo.lastName}
            </span>
          </div>
          <div
            style={{
              backgroundColor:
                secondEvaluation.score >= 70
                  ? "#dcfce7"
                  : secondEvaluation.score >= 50
                    ? "#fef3c7"
                    : "#fee2e2",
              color:
                secondEvaluation.score >= 70
                  ? "#166534"
                  : secondEvaluation.score >= 50
                    ? "#92400e"
                    : "#991b1b",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: "600",
              display: "inline-block",
            }}
          >
            {Math.round(secondEvaluation.score)}%
          </div>
        </div>
      </div>

      {/* Overall Comparison Summary */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "30px",
          backgroundColor: "#f9fafb",
          pageBreakInside: "avoid",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            margin: "0 0 16px 0",
            color: "#1f2937",
          }}
        >
          Resumen de la Comparación
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "11px",
                color: "#6b7280",
                margin: "0 0 4px 0",
              }}
            >
              Puntuación Inicial
            </p>
            <p
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: getColorByPercentage(firstEvaluation.score),
                margin: "0",
              }}
            >
              {Math.round(firstEvaluation.score)}%
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "11px",
                color: "#6b7280",
                margin: "0 0 4px 0",
              }}
            >
              Puntuación Final
            </p>
            <p
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: getColorByPercentage(secondEvaluation.score),
                margin: "0",
              }}
            >
              {Math.round(secondEvaluation.score)}%
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "11px",
                color: "#6b7280",
                margin: "0 0 4px 0",
              }}
            >
              Cambio
            </p>
            <p
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: getDifferenceColor(scoreDifference),
                margin: "0",
              }}
            >
              {scoreDifference > 0 ? "+" : ""}
              {Math.round(scoreDifference)}%
            </p>
          </div>
        </div>
        {percentageDifference !== 0 && (
          <div
            style={{
              backgroundColor: scoreDifference > 0 ? "#dcfce7" : "#fee2e2",
              border: `1px solid ${scoreDifference > 0 ? "#bbf7d0" : "#fecaca"}`,
              borderRadius: "6px",
              padding: "12px",
              marginTop: "16px",
            }}
          >
            <p
              style={{
                color: scoreDifference > 0 ? "#166534" : "#991b1b",
                fontSize: "12px",
                fontWeight: "600",
                margin: "0",
              }}
            >
              {scoreDifference > 0
                ? `📈 Mejora del ${Math.abs(Math.round(percentageDifference))}% entre evaluaciones`
                : `📉 Disminución del ${Math.abs(Math.round(percentageDifference))}% entre evaluaciones`}
            </p>
            <p
              style={{
                color: scoreDifference > 0 ? "#166534" : "#991b1b",
                fontSize: "11px",
                margin: "4px 0 0 0",
              }}
            >
              {scoreDifference > 0
                ? "Las medidas implementadas han mejorado el nivel de seguridad."
                : "Se recomienda revisar las medidas de seguridad implementadas."}
            </p>
          </div>
        )}
      </div>

      {/* Category Comparison */}
      <div
        style={{
          marginBottom: "30px",
          pageBreakInside: "avoid",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            margin: "0 0 20px 0",
            color: "#1f2937",
          }}
        >
          Comparación por Categorías
        </h3>
        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {Object.values(categoryScores).map((category) => {
            const firstPercentage = Math.round(
              (category.firstScore / category.firstMax) * 100
            );
            const secondPercentage = Math.round(
              (category.secondScore / category.secondMax) * 100
            );
            const difference = secondPercentage - firstPercentage;

            return (
              <div
                key={category.category}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  padding: "16px",
                  backgroundColor: "#ffffff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      margin: "0",
                      color: "#1f2937",
                    }}
                  >
                    {category.category}
                  </h4>
                  <div
                    style={{
                      backgroundColor:
                        difference > 0
                          ? "#dcfce7"
                          : difference < 0
                            ? "#fee2e2"
                            : "#f3f4f6",
                      color:
                        difference > 0
                          ? "#166534"
                          : difference < 0
                            ? "#991b1b"
                            : "#6b7280",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: "600",
                    }}
                  >
                    {difference > 0 ? "+" : ""}
                    {difference}%
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#6b7280",
                        margin: "0 0 4px 0",
                      }}
                    >
                      Evaluación 1
                    </p>
                    <div
                      style={{
                        backgroundColor: "#e5e7eb",
                        borderRadius: "4px",
                        height: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor:
                            getColorByPercentage(firstPercentage),
                          height: "100%",
                          width: `${firstPercentage}%`,
                          borderRadius: "4px",
                        }}
                      ></div>
                    </div>
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        margin: "4px 0 0 0",
                        color: getColorByPercentage(firstPercentage),
                      }}
                    >
                      {firstPercentage}%
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#6b7280",
                        margin: "0 0 4px 0",
                      }}
                    >
                      Evaluación 2
                    </p>
                    <div
                      style={{
                        backgroundColor: "#e5e7eb",
                        borderRadius: "4px",
                        height: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor:
                            getColorByPercentage(secondPercentage),
                          height: "100%",
                          width: `${secondPercentage}%`,
                          borderRadius: "4px",
                        }}
                      ></div>
                    </div>
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        margin: "4px 0 0 0",
                        color: getColorByPercentage(secondPercentage),
                      }}
                    >
                      {secondPercentage}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question-by-Question Analysis */}
      <div
        style={{
          pageBreakBefore: "always",
          marginBottom: "30px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            margin: "0 0 20px 0",
            color: "#1f2937",
          }}
        >
          Análisis Detallado por Pregunta
        </h3>
        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          {quizData.questions.map((question) => {
            const firstScore = firstEvaluation.answers[question.id] || 0;
            const secondScore = secondEvaluation.answers[question.id] || 0;
            const maxScore = Math.max(...question.options.map((o) => o.value));
            const difference = secondScore - firstScore;
            const firstPercentage = Math.round((firstScore / maxScore) * 100);
            const secondPercentage = Math.round((secondScore / maxScore) * 100);

            return (
              <div
                key={question.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  padding: "12px",
                  backgroundColor: "#ffffff",
                  pageBreakInside: "avoid",
                }}
              >
                <div style={{ marginBottom: "8px" }}>
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      margin: "0 0 4px 0",
                      color: "#1f2937",
                    }}
                  >
                    {question.text}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#6b7280",
                      margin: "0",
                    }}
                  >
                    Categoría: {question.category || "General"}
                  </p>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 80px",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#6b7280",
                        margin: "0 0 2px 0",
                      }}
                    >
                      Eval. 1: {firstPercentage}%
                    </p>
                    <div
                      style={{
                        backgroundColor: "#e5e7eb",
                        borderRadius: "3px",
                        height: "6px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor:
                            getColorByPercentage(firstPercentage),
                          height: "100%",
                          width: `${firstPercentage}%`,
                          borderRadius: "3px",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#6b7280",
                        margin: "0 0 2px 0",
                      }}
                    >
                      Eval. 2: {secondPercentage}%
                    </p>
                    <div
                      style={{
                        backgroundColor: "#e5e7eb",
                        borderRadius: "3px",
                        height: "6px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor:
                            getColorByPercentage(secondPercentage),
                          height: "100%",
                          width: `${secondPercentage}%`,
                          borderRadius: "3px",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        backgroundColor:
                          difference > 0
                            ? "#dcfce7"
                            : difference < 0
                              ? "#fee2e2"
                              : "#f3f4f6",
                        color:
                          difference > 0
                            ? "#166534"
                            : difference < 0
                              ? "#991b1b"
                              : "#6b7280",
                        padding: "2px 4px",
                        borderRadius: "3px",
                        fontSize: "9px",
                        fontWeight: "600",
                      }}
                    >
                      {difference > 0 ? "+" : ""}
                      {difference}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: "16px",
          marginTop: "30px",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "10px",
        }}
      >
        <p style={{ margin: "0" }}>
          Reporte generado por Ciberseguridad Simple -{" "}
          {format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
        <p style={{ margin: "4px 0 0 0" }}>
          Para más información, visite: www.ciberseguridadsimple.com
        </p>
      </div>
    </div>
  );
}
