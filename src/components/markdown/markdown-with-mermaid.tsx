"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { MermaidRenderer } from "./mermaid-renderer";

interface MarkdownWithMermaidProps {
  children: string;
  className?: string;
}

export function MarkdownWithMermaid({
  children,
  className = "",
}: MarkdownWithMermaidProps) {
  return (
    <div className={`prose prose-slate max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Override the default code block to render Mermaid diagrams
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match && match[1] ? match[1] : "";

            // Render Mermaid block if language is mermaid
            if (language === "mermaid") {
              const chart = String(children).replace(/\n$/, "");
              return <MermaidRenderer chart={chart} />;
            }

            // Otherwise render a regular code block
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Allow proper code block rendering
          pre({ node, children, ...props }) {
            return <pre {...props}>{children}</pre>;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
