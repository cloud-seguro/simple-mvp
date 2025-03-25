"use client";

import { useState, useEffect } from "react";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import Image from "next/image";

// Define the components that can be used in MDX
const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-bold mt-6 mb-3" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-4" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside my-4 pl-5" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside my-4 pl-5" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="mb-1" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-amber-600 hover:underline" {...props} />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <div className="my-6">
      <Image
        className="rounded-lg max-w-full mx-auto"
        src={props.src || ""}
        alt={props.alt || ""}
        width={800}
        height={450}
        style={{ maxWidth: "100%", height: "auto" }}
      />
      {props.alt && (
        <p className="text-center text-sm text-gray-500 mt-2">{props.alt}</p>
      )}
    </div>
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    if (typeof props.children === "string") {
      // If it's an inline code block
      return (
        <code
          className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono"
          {...props}
        />
      );
    }
    // If it's a code block
    return <code {...props} />;
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto my-6 text-sm"
      {...props}
    />
  ),
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-amber-600 pl-4 italic my-6"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-t border-gray-300" />,
};

interface MDXContentProps {
  content: string;
}

export default function MDXContent({ content }: MDXContentProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const serializeMdx = async () => {
      try {
        const result = await serialize(content, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            // Cast to any to avoid type errors with rehypeHighlight
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rehypePlugins: [rehypeHighlight as any],
          },
        });
        setMdxSource(result);
      } catch (error) {
        console.error("Error serializing MDX content:", error);
        const fallback = await serialize("**Error rendering content**");
        setMdxSource(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    serializeMdx();
  }, [content]);

  if (isLoading) {
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

  if (!mdxSource) {
    return (
      <div className="prose prose-lg max-w-none">Could not render content.</div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote {...mdxSource} components={components} />
    </div>
  );
}
