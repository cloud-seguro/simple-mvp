"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/views/landing-page/navbar";
import Footer from "@/components/views/landing-page/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, X } from "lucide-react";
import type { BlogPost } from "@/lib/mdx";

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  _count: {
    posts: number;
  };
}

interface BlogIndexClientProps {
  posts: BlogPost[];
  categories: BlogCategory[];
}

export default function BlogIndexClient({
  posts,
  categories,
}: BlogIndexClientProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Set the document title
  useEffect(() => {
    document.title = "Blog | SIMPLE";
  }, []);

  // Filter posts by category
  useEffect(() => {
    if (selectedCategory) {
      const filtered = posts.filter(
        (post) => post.category?.id === selectedCategory
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [selectedCategory, posts]);

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-36 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
            <p className="text-lg text-gray-600 mb-12 text-center">
              Artículos sobre ciberseguridad, privacidad y protección de datos
            </p>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Filtrar por categoría:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryFilter(null)}
                    className="h-8"
                  >
                    Todas ({posts.length})
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={
                        selectedCategory === category.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleCategoryFilter(category.id)}
                      className="h-8 flex items-center gap-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: category.color || "#6B7280" }}
                      />
                      {category.name} ({category._count.posts})
                    </Button>
                  ))}
                </div>

                {/* Active filter indicator */}
                {selectedCategory && selectedCategoryData && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <span>Mostrando artículos de:</span>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{
                          backgroundColor:
                            selectedCategoryData.color || "#6B7280",
                        }}
                      />
                      {selectedCategoryData.name}
                      <button
                        onClick={() => handleCategoryFilter(null)}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                {selectedCategory ? (
                  <div>
                    <h2 className="text-xl font-medium text-gray-600 mb-2">
                      No hay artículos en esta categoría
                    </h2>
                    <p className="text-gray-500 mb-4">
                      Prueba seleccionando otra categoría o ver todos los
                      artículos.
                    </p>
                    <Button onClick={() => handleCategoryFilter(null)}>
                      Ver todos los artículos
                    </Button>
                  </div>
                ) : (
                  <h2 className="text-xl font-medium text-gray-600">
                    Próximamente artículos...
                  </h2>
                )}
              </div>
            ) : (
              <div className="grid gap-8 md:gap-12">
                {filteredPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="group border-b border-gray-200 pb-8 last:border-b-0"
                  >
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className="grid md:grid-cols-3 gap-6">
                        {post.coverImage && (
                          <div className="md:col-span-1">
                            <div className="relative w-full h-48 md:h-32 overflow-hidden rounded-lg">
                              <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          </div>
                        )}
                        <div
                          className={
                            post.coverImage ? "md:col-span-2" : "md:col-span-3"
                          }
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <time className="text-sm text-gray-500">
                              {post.formattedDate}
                            </time>
                            {post.readingTime && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="text-sm text-gray-500">
                                  {post.readingTime} de lectura
                                </span>
                              </>
                            )}
                            {post.category && (
                              <>
                                <span className="text-gray-300">•</span>
                                <Badge
                                  variant="secondary"
                                  className="flex items-center gap-1"
                                >
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                      backgroundColor:
                                        post.category.color || "#6B7280",
                                    }}
                                  />
                                  {post.category.name}
                                </Badge>
                              </>
                            )}
                          </div>
                          <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h2>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-block bg-gray-100 px-2 py-1 rounded text-xs text-gray-600"
                                >
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > 3 && (
                                <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                                  +{post.tags.length - 3} más
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
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
