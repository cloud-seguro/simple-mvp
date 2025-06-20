"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";
import { Pencil, Trash2, MoreHorizontal, PlusCircle, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    firstName: string | null;
    lastName: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
    color: string;
  } | null;
}

interface BlogListResponse {
  posts: BlogPost[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const { toast } = useToast();

  // Fetch blog posts
  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blog?page=${page}&pageSize=10`);
      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }
      const data: BlogListResponse = await response.json();
      setPosts(data.posts);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      setError((err as Error).message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los artículos del blog",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchPosts(page);
  };

  // Delete a blog post
  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro que deseas eliminar este artículo?")) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog post");
      }

      toast({
        title: "Éxito",
        description: "Artículo eliminado correctamente",
      });

      // Refresh the post list
      fetchPosts(currentPage);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el artículo",
      });
    }
  };

  // Blog content skeleton loader
  const BlogSkeleton = () => (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
              </TableHead>
              <TableHead>
                <div className="h-5 w-20 bg-gray-200 animate-pulse rounded"></div>
              </TableHead>
              <TableHead>
                <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
              </TableHead>
              <TableHead>
                <div className="h-5 w-36 bg-gray-200 animate-pulse rounded"></div>
              </TableHead>
              <TableHead className="text-right">
                <div className="h-5 w-16 bg-gray-200 animate-pulse rounded ml-auto"></div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-6 w-72 bg-gray-200 animate-pulse rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="opacity-50">
                    <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-md ml-auto"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-end gap-1 py-2 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-8 w-8 bg-gray-200 animate-pulse rounded"
          ></div>
        ))}
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Artículos</h2>
        <Button onClick={() => router.push("/dashboard/blog/new")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nuevo artículo
        </Button>
      </div>

      {loading ? (
        <BlogSkeleton />
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-md text-center">
          <h3 className="text-lg font-medium">No hay artículos</h3>
          <p className="mt-2 text-gray-600">
            Comienza creando tu primer artículo de blog
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push("/dashboard/blog/new")}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nuevo artículo
          </Button>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Última actualización</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      {post.category ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{
                              backgroundColor: post.category.color || "#6B7280",
                            }}
                          />
                          <span className="text-sm">{post.category.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Sin categoría
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {post.published ? (
                        <Badge>Publicado</Badge>
                      ) : (
                        <Badge variant="outline">Borrador</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDistance(new Date(post.updatedAt), new Date(), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/blog/${post.slug}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/blog/${post.id}`}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
