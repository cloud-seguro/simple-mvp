"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/views/landing-page/navbar";
import Footer from "@/components/views/landing-page/Footer";
import type { BlogPost } from "@/lib/mdx";

interface BlogIndexClientProps {
  posts: BlogPost[];
}

export default function BlogIndexClient({ posts }: BlogIndexClientProps) {
  // Set the document title
  useEffect(() => {
    document.title = "Blog | SIMPLE";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-36 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
            <p className="text-lg text-gray-600 mb-12 text-center">
              Artículos sobre ciberseguridad, privacidad y protección de datos
            </p>

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium text-gray-600">
                  Próximamente artículos...
                </h2>
              </div>
            ) : (
              <div className="space-y-12">
                {posts.map((post) => (
                  <article key={post.slug} className="border-b pb-8">
                    <Link href={`/blog/${post.slug}`} legacyBehavior={false}>
                      <div className="group">
                        {post.coverImage && (
                          <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <h2 className="text-2xl font-semibold mb-3 group-hover:text-amber-600 transition-colors">
                          {post.title}
                        </h2>
                      </div>
                    </Link>

                    <div className="text-sm text-gray-500 mb-3 flex items-center gap-3">
                      <span>{post.formattedDate}</span>
                      <span>•</span>
                      <span>{post.readingTime} de lectura</span>
                    </div>

                    <p className="text-gray-600 mb-4">{post.excerpt}</p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-amber-600 font-medium hover:underline inline-flex items-center"
                      legacyBehavior={false}
                    >
                      Leer más
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
