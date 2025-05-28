"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2pdf from "html2pdf.js";
import { PDFComparisonTemplate } from "./pdf-comparison-template";
import type { QuizData, UserInfo } from "./types";

interface ComparisonData {
  id: string;
  title: string;
  date: Date;
  answers: Record<string, number>;
  userInfo: UserInfo;
  score: number;
}

interface PDFComparisonExportProps {
  firstEvaluation: ComparisonData;
  secondEvaluation: ComparisonData;
  quizData: QuizData;
  evaluationType: "INITIAL" | "ADVANCED";
  children: React.ReactNode;
  renderButtons?: (exportButton: React.ReactNode) => React.ReactNode;
}

export function PDFComparisonExport({
  firstEvaluation,
  secondEvaluation,
  quizData,
  evaluationType,
  children,
  renderButtons,
}: PDFComparisonExportProps) {
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
        filename: `comparacion-evaluaciones-${firstEvaluation.id}-${secondEvaluation.id}.pdf`,
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
      console.error("Error exporting comparison PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportButton = (
    <Button
      variant="outline"
      className="gap-2 bg-yellow-500 text-black hover:bg-yellow-600"
      onClick={handleExportPDF}
      disabled={isExporting}
    >
      <Download className="h-4 w-4" />
      {isExporting ? "Generando PDF..." : "Exportar PDF"}
    </Button>
  );

  return (
    <div className="relative w-full">
      {/* Conditionally render buttons based on renderButtons prop */}
      {renderButtons ? (
        renderButtons(exportButton)
      ) : (
        <div className="absolute top-0 right-0 z-10">{exportButton}</div>
      )}

      {/* Regular display content */}
      <div className="w-full">{children}</div>

      {/* Hidden PDF template that will be used for export */}
      <div className="hidden print-only" ref={templateRef}>
        <PDFComparisonTemplate
          firstEvaluation={firstEvaluation}
          secondEvaluation={secondEvaluation}
          quizData={quizData}
          evaluationType={evaluationType}
        />
      </div>
    </div>
  );
}
