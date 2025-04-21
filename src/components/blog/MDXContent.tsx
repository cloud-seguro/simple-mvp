"use client";

import { useState, useEffect } from "react";
import { MarkdownWithMermaid } from "@/components/markdown/markdown-with-mermaid";

interface MDXContentProps {
  content: string;
}

export default function MDXContent({ content }: MDXContentProps) {
  const [isClient, setIsClient] = useState(false);

  // Only render the Mermaid diagrams on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="prose prose-lg max-w-none">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mt-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mdx-content prose-lg">
      <MarkdownWithMermaid>{content}</MarkdownWithMermaid>
    </div>
  );
}
