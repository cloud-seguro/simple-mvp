"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useToast } from "@/components/ui/use-toast";

// Add isSpace function to window to ensure it's globally available
// This is a workaround for a bug in mermaid
if (typeof window !== "undefined") {
  (window as unknown as { isSpace: (char: string) => boolean }).isSpace = (
    char: string
  ) => /\s/.test(char);
}

interface MermaidRendererProps {
  chart: string;
  className?: string;
}

interface CustomWindow extends Window {
  isSpace?: (char: string) => boolean;
}

interface Mermaid {
  initialize: (config: MermaidConfig) => void;
  render: (id: string, chart: string) => Promise<{ svg: string }>;
  isSpace?: (char: string) => boolean;
}

interface MermaidConfig {
  startOnLoad: boolean;
  theme: string;
  securityLevel: string;
  fontFamily: string;
}

export function MermaidRenderer({
  chart,
  className = "",
}: MermaidRendererProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mermaidId = useRef(
    `mermaid-${Math.random().toString(36).substring(2, 11)}`
  );
  const { toast } = useToast();

  useEffect(() => {
    try {
      // Make isSpace available to mermaid
      if (
        !mermaid.hasOwnProperty("isSpace") &&
        typeof (window as unknown as CustomWindow).isSpace === "function"
      ) {
        (mermaid as Mermaid).isSpace = (
          window as unknown as CustomWindow
        ).isSpace;
      }

      // Configure mermaid
      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      });

      const renderChart = async () => {
        try {
          setError(null);

          // Make sure chart is valid
          if (typeof chart !== "string" || !chart.trim()) {
            throw new Error("Diagrama vacío o inválido");
          }

          // Try to render with error handling
          try {
            const { svg } = await mermaid.render(mermaidId.current, chart);
            setSvg(svg);
          } catch (renderErr) {
            console.error("Error rendering mermaid chart:", renderErr);

            // Specifically handle isSpace not defined error
            if (
              renderErr instanceof Error &&
              renderErr.toString().includes("isSpace is not defined")
            ) {
              // Try to add isSpace to window and retry
              (window as unknown as CustomWindow).isSpace = (char: string) =>
                /\s/.test(char);

              try {
                const { svg } = await mermaid.render(mermaidId.current, chart);
                setSvg(svg);
                return; // Success on retry
              } catch (retryErr) {
                console.error(
                  "Failed on retry after adding isSpace:",
                  retryErr
                );
              }
            }

            // Show error toast
            toast({
              variant: "destructive",
              title: "Error de diagrama Mermaid",
              description:
                "Error al renderizar el diagrama. Sintaxis incorrecta o problema técnico.",
            });

            setError(
              "Error al renderizar el diagrama. Por favor verifica la sintaxis."
            );
          }
        } catch (err) {
          console.error("Failed to process mermaid chart:", err);

          const errorMessage =
            err instanceof Error
              ? err.message
              : "Error al procesar el diagrama. Por favor verifica la sintaxis.";

          setError(errorMessage);

          toast({
            variant: "destructive",
            title: "Error de diagrama",
            description: errorMessage,
          });
        }
      };

      renderChart();
    } catch (initErr) {
      console.error("Error initializing mermaid:", initErr);
      setError("Error al inicializar el renderizador de diagramas");
      toast({
        variant: "destructive",
        title: "Error de diagrama",
        description: "No se pudo inicializar el renderizador de diagramas",
      });
    }
  }, [chart, toast]);

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md mb-4">
        <p className="font-medium mb-2">Error al renderizar diagrama</p>
        <pre className="text-sm overflow-auto p-2 bg-red-100 rounded">
          {chart}
        </pre>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  // Avoid returning anything if there's no valid SVG to render
  if (!svg) {
    return (
      <div className="p-4 border border-gray-300 bg-gray-50 rounded-md mb-4">
        <p className="font-medium text-gray-600">Cargando diagrama...</p>
      </div>
    );
  }

  // Return a safe wrapper that breaks out of any parent paragraph context
  return (
    <>
      <div className="non-mermaid-wrapper my-4">
        <div
          ref={containerRef}
          className={`mermaid-chart overflow-auto bg-gray-50 p-4 rounded-md ${className}`}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </>
  );
}
