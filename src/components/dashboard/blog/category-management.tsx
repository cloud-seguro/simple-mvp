"use client";

import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Tag,
  Palette,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Color options for categories
const COLOR_OPTIONS = [
  { value: "#6366f1", label: "Índigo", class: "bg-indigo-500" },
  { value: "#8b5cf6", label: "Violeta", class: "bg-violet-500" },
  { value: "#06b6d4", label: "Cian", class: "bg-cyan-500" },
  { value: "#10b981", label: "Esmeralda", class: "bg-emerald-500" },
  { value: "#f59e0b", label: "Ámbar", class: "bg-amber-500" },
  { value: "#ef4444", label: "Rojo", class: "bg-red-500" },
  { value: "#ec4899", label: "Rosa", class: "bg-pink-500" },
  { value: "#6b7280", label: "Gris", class: "bg-gray-500" },
];

// Form schema for category
const categorySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  color: z.string().min(1, "El color es obligatorio"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    posts: number;
  };
  createdBy: {
    firstName: string | null;
    lastName: string | null;
  };
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Form setup
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#6366f1",
    },
  });

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blog/categories?includeInactive=true");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data: BlogCategory[] = await response.json();
      setCategories(data);
    } catch (err) {
      setError((err as Error).message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las categorías",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle form submission
  const onSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      const endpoint = editingCategory
        ? `/api/blog/categories/${editingCategory.id}`
        : "/api/blog/categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save category");
      }

      toast({
        title: "Éxito",
        description: editingCategory
          ? "Categoría actualizada correctamente"
          : "Categoría creada correctamente",
      });

      // Reset form and close dialog
      form.reset();
      setIsDialogOpen(false);
      setEditingCategory(null);

      // Refresh categories
      fetchCategories();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as Error).message ||
          "Ocurrió un error al guardar la categoría",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      description: category.description || "",
      color: category.color,
    });
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro que deseas eliminar esta categoría?")) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete category");
      }

      toast({
        title: "Éxito",
        description: "Categoría eliminada correctamente",
      });

      // Refresh categories
      fetchCategories();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as Error).message || "No se pudo eliminar la categoría",
      });
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (category: BlogCategory) => {
    try {
      const response = await fetch(`/api/blog/categories/${category.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: category.name,
          description: category.description,
          color: category.color || "#6B7280",
          active: !category.active,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update category");
      }

      toast({
        title: "Éxito",
        description: `Categoría ${!category.active ? "activada" : "desactivada"} correctamente`,
      });

      // Refresh categories
      fetchCategories();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as Error).message || "No se pudo actualizar la categoría",
      });
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    form.reset();
  };

  // Loading skeleton
  const CategorySkeleton = () => (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
            </TableHead>
            <TableHead>
              <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
            </TableHead>
            <TableHead>
              <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
            </TableHead>
            <TableHead>
              <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
            </TableHead>
            <TableHead className="text-right">
              <div className="h-5 w-16 bg-gray-200 animate-pulse rounded ml-auto"></div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3].map((i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
              </TableCell>
              <TableCell>
                <div className="h-6 w-6 bg-gray-200 animate-pulse rounded-full"></div>
              </TableCell>
              <TableCell>
                <div className="h-5 w-8 bg-gray-200 animate-pulse rounded"></div>
              </TableCell>
              <TableCell>
                <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
              </TableCell>
              <TableCell className="text-right">
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-md ml-auto"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Categorías
          </h2>
          <p className="text-sm text-muted-foreground">
            Organiza tus artículos por categorías
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva categoría
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Editar categoría" : "Nueva categoría"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? "Modifica los datos de la categoría"
                  : "Crea una nueva categoría para organizar tus artículos"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nombre de la categoría"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descripción de la categoría"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Color
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-4 gap-2">
                          {COLOR_OPTIONS.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              className={`
                                w-full h-10 rounded-md border-2 transition-all
                                ${
                                  field.value === color.value
                                    ? "border-gray-900 scale-105"
                                    : "border-gray-200 hover:border-gray-300"
                                }
                                ${color.class}
                              `}
                              onClick={() => field.onChange(color.value)}
                              title={color.label}
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Guardando..."
                      : editingCategory
                        ? "Actualizar"
                        : "Crear"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <CategorySkeleton />
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-md text-center">
          <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No hay categorías</h3>
          <p className="mt-2 text-gray-600">
            Comienza creando tu primera categoría para organizar los artículos
          </p>
          <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva categoría
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creada</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-muted-foreground">
                          {category.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className="w-6 h-6 rounded-full border border-gray-200"
                      style={{ backgroundColor: category.color || "#6B7280" }}
                      title={category.color || "#6B7280"}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{category._count.posts}</Badge>
                  </TableCell>
                  <TableCell>
                    {category.active ? (
                      <Badge>Activa</Badge>
                    ) : (
                      <Badge variant="outline">Inactiva</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDistance(new Date(category.createdAt), new Date(), {
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
                        <DropdownMenuItem onClick={() => handleEdit(category)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleActive(category)}
                        >
                          {category.active ? "Desactivar" : "Activar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(category.id)}
                          disabled={category._count.posts > 0}
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
      )}
    </div>
  );
}
