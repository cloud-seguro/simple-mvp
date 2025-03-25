"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/views/landing-page/navbar";
import Footer from "@/components/views/landing-page/Footer";
import MDXContent from "./MDXContent";
import type { BlogPost } from "@/lib/mdx";

interface BlogPostClientProps {
  post?: BlogPost;
  error?: boolean;
}

export default function BlogPostClient({
  post,
  error = false,
}: BlogPostClientProps) {
  useEffect(() => {
    if (post) {
      // Set the document title based on the post title
      document.title = `${post.title} | SIMPLE Blog`;
    } else if (error) {
      // Set a fallback title
      document.title = "Post Not Found | SIMPLE Blog";
    }
  }, [post, error]);

  // Handle error state
  if (error || !post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-36 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <article className="max-w-3xl mx-auto">
            {/* Back to blog link */}
            <Link
              href="/blog"
              className="text-amber-600 font-medium hover:underline inline-flex items-center mb-8"
              legacyBehavior={false}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver al blog
            </Link>

            {/* Post header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <div className="text-gray-500 flex items-center gap-3 mb-6">
                <span>{post.formattedDate}</span>
                <span>•</span>
                <span>{post.readingTime} de lectura</span>
              </div>
              {post.coverImage && (
                <div className="relative w-full h-[400px] mb-8 overflow-hidden rounded-lg">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </header>

            {/* Post content */}
            <MDXContent content={post.content} />

            {/* Post footer with tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t">
                <h3 className="text-sm text-gray-500 mb-2">Etiquetas:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
