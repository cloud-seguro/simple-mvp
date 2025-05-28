"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2pdf from "html2pdf.js";
import { PDFTemplate } from "./pdf-template";
import type { QuizData, UserInfo } from "./types";

interface PDFExportProps {
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
  children: React.ReactNode;
}

export function PDFExport({
  evaluationId,
  score,
  maxScore,
  maturityDescription,
  maturityLevelNumber,
  categories,
  recommendations,
  quizData,
  userInfo,
  children,
}: PDFExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!templateRef.current) return;

    setIsExporting(true);
    try {
      const element = templateRef.current;

      // Show the template during export
      element.style.display = "block";

      const opt = {
        margin: 0.5,
        filename: `evaluacion-${evaluationId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        enableLinks: true,
        footer: {
          height: "0.5in",
          contents: {
            default:
              '<div style="text-align: center; font-size: 10px; color: #666;">Página {{page}} de {{pages}} | Ciberseguridad Simple</div>',
          },
        },
      };

      await html2pdf().set(opt).from(element).save();

      // Hide the template after export
      element.style.display = "none";
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="absolute top-0 right-0 z-10">
        <Button
          variant="outline"
          className="gap-2 bg-yellow-500 text-black hover:bg-yellow-600"
          onClick={handleExportPDF}
          disabled={isExporting}
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Generando PDF..." : "Exportar PDF"}
        </Button>
      </div>

      {/* Regular display content */}
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Resultados de Evaluación
          </h1>
          <p className="text-gray-600">ID de Evaluación: {evaluationId}</p>
        </div>
        <div className="space-y-6">{children}</div>
      </div>

      {/* Hidden PDF template that will be used for export */}
      <div className="hidden print-only" ref={templateRef}>
        <PDFTemplate
          evaluationId={evaluationId}
          score={score}
          maxScore={maxScore}
          maturityDescription={maturityDescription}
          maturityLevelNumber={maturityLevelNumber}
          categories={categories}
          recommendations={recommendations}
          quizData={quizData}
          userInfo={userInfo}
        />
      </div>
    </div>
  );
}
