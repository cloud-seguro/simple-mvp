import html2pdf from "html2pdf.js";
import type {
  BreachResultAPI,
  PasswordAnalysisAPI,
} from "@/types/breach-verification";
import { RiskLevel, BreachSearchType } from "@prisma/client";

interface PDFExportData {
  searchValue: string;
  searchType: string | BreachSearchType;
  breachCount: number;
  riskLevel: RiskLevel;
  results: BreachResultAPI[];
  passwordAnalysis: PasswordAnalysisAPI[];
  timestamp: Date;
  completedAt?: Date | null;
  summary?: {
    searchTypeLabel: string;
    riskLevelLabel: string;
    verifiedResults: number;
    totalDataTypes: number;
  };
}

// Helper functions for formatting
const getRiskClass = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case RiskLevel.HIGH:
    case RiskLevel.CRITICAL:
      return "risk-high";
    case RiskLevel.MEDIUM:
      return "risk-medium";
    case RiskLevel.LOW:
    default:
      return "risk-low";
  }
};

const getRiskLabel = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case RiskLevel.HIGH:
    case RiskLevel.CRITICAL:
      return "Alto";
    case RiskLevel.MEDIUM:
      return "Medio";
    case RiskLevel.LOW:
    default:
      return "Bajo";
  }
};

const getSeverityClass = (severity: string): string => {
  switch (severity.toUpperCase()) {
    case "CRITICAL":
      return "severity-critical";
    case "HIGH":
      return "severity-high";
    case "MEDIUM":
      return "severity-medium";
    case "LOW":
    default:
      return "severity-low";
  }
};

const getSeverityLabel = (severity: string): string => {
  switch (severity.toUpperCase()) {
    case "CRITICAL":
      return "Crítica";
    case "HIGH":
      return "Alta";
    case "MEDIUM":
      return "Media";
    case "LOW":
    default:
      return "Baja";
  }
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatBreachDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return "Fecha desconocida";
  }
};

const getSearchTypeLabel = (searchType: string | BreachSearchType): string => {
  if (typeof searchType === "string") {
    return searchType === "EMAIL" ? "📧 Correo Electrónico" : "🌐 Dominio";
  }
  return searchType === BreachSearchType.EMAIL
    ? "📧 Correo Electrónico"
    : "🌐 Dominio";
};

export const generateBreachReportPDF = async (
  data: PDFExportData
): Promise<void> => {
  const {
    searchValue,
    searchType,
    breachCount,
    riskLevel,
    results,
    passwordAnalysis,
    timestamp,
    completedAt,
    summary,
  } = data;

  // Validate required data
  if (!searchValue) {
    console.error("❌ PDF Export - Missing searchValue");
    throw new Error("Valor de búsqueda requerido para generar el PDF");
  }

  if (!timestamp) {
    console.error("❌ PDF Export - Missing timestamp");
    throw new Error("Timestamp requerido para generar el PDF");
  }

  console.log("✅ PDF Export - Generando contenido HTML...");

  // Create enhanced HTML content for the PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reporte de Análisis de Brechas - ${searchValue}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background: #fff;
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          margin-bottom: 30px;
        }
        
        .header h1 {
          font-size: 32px;
          margin-bottom: 10px;
          font-weight: bold;
        }
        
        .header p {
          font-size: 18px;
          opacity: 0.9;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .summary-card {
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .summary-item {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          text-align: center;
        }
        
        .summary-item h3 {
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .summary-item p {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        
        .risk-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          text-transform: uppercase;
        }
        
        .risk-high {
          background: #fee2e2;
          color: #dc2626;
        }
        
        .risk-medium {
          background: #fef3c7;
          color: #d97706;
        }
        
        .risk-low {
          background: #dcfce7;
          color: #16a34a;
        }
        
        .section {
          margin-bottom: 40px;
        }
        
        .section h2 {
          font-size: 24px;
          margin-bottom: 20px;
          color: #333;
          border-bottom: 3px solid #667eea;
          padding-bottom: 10px;
        }
        
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .table th,
        .table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }
        
        .table th {
          background: #667eea;
          color: white;
          font-weight: bold;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .table tr:last-child td {
          border-bottom: none;
        }
        
        .table tr:nth-child(even) {
          background: #f8f9fa;
        }
        
        .severity-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        
        .severity-critical {
          background: #fee2e2;
          color: #dc2626;
        }
        
        .severity-high {
          background: #fef3c7;
          color: #d97706;
        }
        
        .severity-medium {
          background: #e0f2fe;
          color: #0369a1;
        }
        
        .severity-low {
          background: #dcfce7;
          color: #16a34a;
        }
        
        .data-types {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        
        .data-type {
          background: #e5e7eb;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          color: #374151;
        }
        
        .no-data {
          text-align: center;
          padding: 40px;
          color: #6b7280;
          background: #f9fafb;
          border-radius: 8px;
          font-size: 16px;
        }
        
        .meta-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-top: 30px;
          font-size: 14px;
          color: #6c757d;
          border-left: 4px solid #667eea;
        }
        
        .strength-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: bold;
        }
        
        .strength-fuerte {
          background: #dcfce7;
          color: #16a34a;
        }
        
        .strength-media {
          background: #fef3c7;
          color: #d97706;
        }
        
        .strength-debil {
          background: #fee2e2;
          color: #dc2626;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🛡️ SIMPLE BREACH</h1>
        <p>Reporte de Análisis de Brechas de Seguridad</p>
      </div>
      
      <div class="container">
        <!-- Summary Section -->
        <div class="summary-card">
          <h2 style="margin-bottom: 20px; color: #333; border: none; font-size: 20px;">📊 Resumen del Análisis</h2>
          <div class="summary-grid">
            <div class="summary-item">
              <h3>Tipo de Búsqueda</h3>
              <p>${summary?.searchTypeLabel || getSearchTypeLabel(searchType)}</p>
            </div>
            <div class="summary-item">
              <h3>Término Analizado</h3>
              <p style="font-family: monospace; font-size: 18px; word-break: break-all;">${searchValue}</p>
            </div>
            <div class="summary-item">
              <h3>Brechas Detectadas</h3>
              <p style="color: ${breachCount > 0 ? "#dc2626" : "#16a34a"};">${breachCount}</p>
            </div>
            <div class="summary-item">
              <h3>Nivel de Riesgo</h3>
              <p>
                <span class="risk-badge ${getRiskClass(riskLevel)}">
                  ${summary?.riskLevelLabel || getRiskLabel(riskLevel)}
                </span>
              </p>
            </div>
          </div>
          ${
            summary
              ? `
          <div class="summary-grid">
            <div class="summary-item">
              <h3>Resultados Verificados</h3>
              <p>${summary.verifiedResults}</p>
            </div>
            <div class="summary-item">
              <h3>Tipos de Datos Únicos</h3>
              <p>${summary.totalDataTypes}</p>
            </div>
            <div class="summary-item">
              <h3>Fecha de Análisis</h3>
              <p style="font-size: 16px;">${formatDate(timestamp)}</p>
            </div>
            <div class="summary-item">
              <h3>Estado</h3>
              <p style="color: #16a34a;">✅ Completado</p>
            </div>
          </div>
          `
              : ""
          }
        </div>

        <!-- Breach Results Section -->
        ${
          results && results.length > 0
            ? `
        <div class="section">
          <h2>🔍 Brechas Detectadas (${results.length})</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Nombre de la Brecha</th>
                <th>Fecha</th>
                <th>Datos Afectados</th>
                <th>Severidad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${results
                .map(
                  (result) => `
                <tr>
                  <td style="font-weight: 600;">${result.breachName || "Sin nombre"}</td>
                  <td>${formatBreachDate(result.breachDate)}</td>
                  <td>
                    <div class="data-types">
                      ${(result.dataTypes || []).map((type) => `<span class="data-type">${type}</span>`).join("")}
                    </div>
                  </td>
                  <td>
                    <span class="severity-badge ${getSeverityClass(result.severity)}">
                      ${getSeverityLabel(result.severity)}
                    </span>
                  </td>
                  <td>${result.isVerified ? "✅ Verificado" : "⚠️ Sin verificar"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
        `
            : `
        <div class="section">
          <h2>🔍 Brechas Detectadas</h2>
          <div class="no-data">
            ✅ No se encontraron brechas de datos para este análisis
          </div>
        </div>
        `
        }
        
        <!-- Password Analysis Section -->
        ${
          passwordAnalysis && passwordAnalysis.length > 0
            ? `
        <div class="section">
          <h2>🔒 Análisis de Contraseñas (${passwordAnalysis.length})</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Contraseña</th>
                <th>Apariciones</th>
                <th>Fortaleza</th>
                <th>Recomendación</th>
              </tr>
            </thead>
            <tbody>
              ${passwordAnalysis
                .map(
                  (pwd) => `
                <tr>
                  <td style="font-family: monospace; background: #f5f5f5; padding: 8px;">
                    ${pwd.passwordHash.substring(0, 4)}${"*".repeat(Math.max(0, pwd.passwordHash.length - 4))}
                  </td>
                  <td style="text-align: center; font-weight: bold; color: ${pwd.occurrences > 100 ? "#dc2626" : "#d97706"};">
                    ${pwd.occurrences.toLocaleString()}
                  </td>
                  <td>
                    <span class="strength-badge strength-${pwd.strength.toLowerCase()}">
                      ${pwd.strength}
                    </span>
                  </td>
                  <td style="font-size: 12px;">${pwd.recommendation}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
        `
            : ""
        }

        <!-- Footer Information -->
        <div class="meta-info">
          <p><strong>📋 Información del Reporte:</strong></p>
          <p>• Generado el: ${formatDate(timestamp)}</p>
          ${completedAt ? `<p>• Análisis completado el: ${formatDate(completedAt)}</p>` : ""}
          <p>• Plataforma: SIMPLE BREACH - Sistema de Verificación de Brechas</p>
          <p>• Este reporte contiene información sensible. Manéjelo con cuidado.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Continue with existing PDF generation logic
  console.log("✅ PDF Export - Contenido HTML generado, creando PDF...");

  // Generate PDF using html2pdf
  const element = document.createElement("div");
  element.innerHTML = htmlContent;

  // Configure html2pdf options for better quality
  const opt = {
    margin: 10,
    filename: `breach-analysis-${searchValue}-${new Date().toISOString().split("T")[0]}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      scrollY: 0,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
  };

  try {
    await html2pdf().set(opt).from(element).save();
    console.log("✅ PDF Export - PDF generado y descargado exitosamente");
  } catch (error) {
    console.error("❌ PDF Export - Error en la generación final:", error);
    throw new Error("Error al generar el archivo PDF");
  }
};
