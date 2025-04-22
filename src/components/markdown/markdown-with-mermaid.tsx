"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { MermaidRenderer } from "./mermaid-renderer";
import { useToast } from "@/components/ui/use-toast";

// Ensure isSpace is defined globally
if (typeof window !== "undefined") {
  (window as unknown as { isSpace: (char: string) => boolean }).isSpace = (
    char: string
  ) => /\s/.test(char);
}

interface MarkdownWithMermaidProps {
  children: string;
  className?: string;
}

export function MarkdownWithMermaid({
  children,
  className = "",
}: MarkdownWithMermaidProps) {
  const { toast } = useToast();

  // Process the markdown content to extract and replace mermaid code blocks
  // This helps avoid nesting issues by handling mermaid blocks separately
  const { processedContent, mermaidBlocks } = useMemo(() => {
    try {
      const blocks: string[] = [];
      // Guard against invalid input
      if (typeof children !== "string") {
        return { processedContent: "", mermaidBlocks: blocks };
      }

      const mermaidPattern = /```mermaid\n([\s\S]*?)```/g;

      // Replace mermaid code blocks with placeholders
      const processed = children.replace(mermaidPattern, (match, content) => {
        blocks.push(content.trim());
        // Create a placeholder that won't cause nesting issues
        return `:::mermaid-block-${blocks.length - 1}:::`;
      });

      return { processedContent: processed, mermaidBlocks: blocks };
    } catch (error) {
      console.error("Error processing markdown:", error);
      toast({
        variant: "destructive",
        title: "Error de procesamiento",
        description: "Error al procesar el contenido markdown.",
      });
      return { processedContent: children || "", mermaidBlocks: [] };
    }
  }, [children, toast]);

  // If no content to render, return empty div
  if (!processedContent) {
    return <div className={className || ""}></div>;
  }

  // Create a safe wrapper for mermaid rendering that catches any potential errors
  const SafeMermaidRenderer = ({ chart }: { chart: string }) => {
    try {
      return <MermaidRenderer chart={chart} />;
    } catch (error) {
      console.error("Error in MermaidRenderer:", error);
      return (
        <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
          <p className="font-medium">Error al renderizar diagrama</p>
          <p className="text-sm mt-2">
            Ocurrió un error al renderizar el diagrama. Por favor revisa la
            sintaxis.
          </p>
        </div>
      );
    }
  };

  return (
    <div className={`prose prose-slate max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Special handler for mermaid blocks using our placeholders
          p: ({ children, ...props }) => {
            try {
              const content = String(children || "");
              const mermaidMatch = content.match(/^:::mermaid-block-(\d+):::$/);

              if (mermaidMatch) {
                const blockIndex = parseInt(mermaidMatch[1], 10);
                if (Number.isInteger(blockIndex) && mermaidBlocks[blockIndex]) {
                  return (
                    <SafeMermaidRenderer chart={mermaidBlocks[blockIndex]} />
                  );
                }
              }

              // Check for other potential nesting issues
              if (
                content.includes("<div") ||
                content.includes("<pre") ||
                content.includes("<table")
              ) {
                return <>{children}</>;
              }

              return <p {...props}>{children}</p>;
            } catch (error) {
              console.error("Error in paragraph component:", error);
              return <p {...props}>{children}</p>;
            }
          },

          // Standard code block handler for non-mermaid code
          code: ({ className, children, ...props }) => {
            try {
              const match = /language-(\w+)/.exec(className || "");
              const language = match && match[1] ? match[1] : "";

              // Skip mermaid rendering here, we handled it separately with placeholders
              if (language === "mermaid") {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }

              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            } catch (error) {
              console.error("Error in code component:", error);
              return <code {...props}>{children}</code>;
            }
          },

          // Handle pre tags to avoid nesting issues
          pre: ({ children, ...props }) => {
            try {
              return (
                <pre className="pre-wrap" {...props}>
                  {children}
                </pre>
              );
            } catch (error) {
              console.error("Error in pre component:", error);
              return <pre {...props}>{children}</pre>;
            }
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
