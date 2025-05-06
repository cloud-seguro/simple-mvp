"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2pdf from "html2pdf.js";

interface PDFExportProps {
  evaluationId: string;
  children: React.ReactNode;
}

export function PDFExport({ evaluationId, children }: PDFExportProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!targetRef.current) return;

    setIsExporting(true);
    try {
      const element = targetRef.current;

      const opt = {
        margin: 0,
        filename: `evaluacion-${evaluationId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: true,
          letterRendering: true,
          scrollY: 0,
          windowWidth: undefined,
          windowHeight: undefined,
        },
        jsPDF: {
          unit: "in",
          format: "letter",
          orientation: "portrait",
        },
      };

      await html2pdf().set(opt).from(element).save();
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
          className="gap-2 bg-yellow-500 text-black"
          onClick={handleExportPDF}
          disabled={isExporting}
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Generando PDF..." : "Exportar PDF"}
        </Button>
      </div>

      <div
        ref={targetRef}
        className="bg-white p-8 rounded-xl shadow-sm w-full max-w-4xl mx-auto"
        style={{ minWidth: "800px" }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Resultados de Evaluación
          </h1>
          <p className="text-gray-600">ID de Evaluación: {evaluationId}</p>
        </div>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
