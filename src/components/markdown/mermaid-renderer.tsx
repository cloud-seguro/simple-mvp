"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidRendererProps {
  chart: string;
  className?: string;
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

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
    });

    const renderChart = async () => {
      try {
        setError(null);
        const { svg } = await mermaid.render(mermaidId.current, chart);
        setSvg(svg);
      } catch (err) {
        console.error("Failed to render mermaid chart:", err);
        setError("Failed to render chart. Please check your syntax.");
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md mb-4">
        <p className="font-medium mb-2">Error rendering chart</p>
        <pre className="text-sm overflow-auto p-2 bg-red-100 rounded">
          {chart}
        </pre>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-chart overflow-auto bg-gray-50 p-4 rounded-md my-6 ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
