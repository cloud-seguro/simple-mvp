"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateSlug } from "@/lib/utils";
import { MarkdownWithMermaid } from "@/components/markdown/markdown-with-mermaid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, FileText, Trash } from "lucide-react";
import { DeleteBlogPostAlertDialog } from "./delete-blog-post-alert-dialog";
import { EnhancedEditor } from "./enhanced-editor";
import { BlogImageUpload } from "./blog-image-upload";
import "@/styles/enhanced-editor.css";
import { BlogPostStatus } from "@/types/blog";

// Define the form schema
const blogPostSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  slug: z.string().min(1, "El slug es obligatorio"),
  excerpt: z.string().min(1, "El resumen es obligatorio"),
  coverImage: z.string().optional(),
  content: z.string().min(1, "El contenido es obligatorio"),
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.nativeEnum(BlogPostStatus),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

// Define the props for the component
interface BlogPostEditorProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    published?: boolean;
    tags?: string[];
    description?: string;
    featuredImage?: string;
    status: BlogPostStatus | string;
  } | null; // The post to edit, null if creating a new post
  authorId: string; // The ID of the current user
}

export function BlogPostEditor({ post, authorId }: BlogPostEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("rich-editor");
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [tempPostId, setTempPostId] = useState<string>("");
  const [content, setContent] = useState<string>(post?.content || "");
  const [isCopied, setIsCopied] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Generate a temporary ID for new posts (for image uploads)
  useEffect(() => {
    if (!post?.id) {
      setTempPostId(`temp-${Math.random().toString(36).substring(2)}`);
    }
  }, [post]);

  // Initialize form with existing post data or defaults
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      excerpt: post?.excerpt || "",
      coverImage: post?.coverImage || "",
      content: post?.content || "",
      published: post?.status === BlogPostStatus.PUBLISHED,
      tags: post?.tags || [],
      description: post?.description || "",
      featuredImage: post?.featuredImage || "",
      status: (post?.status as BlogPostStatus) || BlogPostStatus.DRAFT,
    },
  });

  // Set initial content
  useEffect(() => {
    setContent(post?.content || "");
    setMarkdownContent(post?.content || "");
  }, [post]);

  // Update preview content when form content changes
  useEffect(() => {
    setMarkdownContent(form.getValues("content"));
  }, [form]);

  // Handle title change to auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("title", value);

    // Only auto-generate slug if it's a new post or slug field hasn't been manually edited
    if (!post || !form.getValues("slug")) {
      const slug = generateSlug(value);
      form.setValue("slug", slug);
    }
  };

  // Handle image upload complete
  const handleImageUploadComplete = (imageUrl: string) => {
    form.setValue("coverImage", imageUrl);
  };

  // Handle image upload error
  const handleImageUploadError = (error: Error) => {
    toast({
      variant: "destructive",
      title: "Error al subir la imagen",
      description: error.message,
    });
  };

  // Handle form submission
  const onSubmit = async (values: BlogPostFormValues) => {
    try {
      const endpoint = post ? `/api/blog/${post.id}` : "/api/blog/create";
      const method = post ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          authorId: post ? undefined : authorId, // Only needed for new posts
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save post");
      }

      toast({
        title: "Éxito",
        description: post
          ? "Artículo actualizado correctamente"
          : "Artículo creado correctamente",
      });

      // Redirect to blog management
      router.push("/dashboard/blog");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as Error).message || "Ocurrió un error al guardar el artículo",
      });
    }
  };

  // Add example Mermaid diagram to content
  const insertMermaidExample = () => {
    const example = `\`\`\`mermaid
flowchart LR
  subgraph VPC
    A[Public Subnet] -->|HTTPS| API[(API Gateway)]
    B[Private Subnet] --> DB[(PostgreSQL)]
    API --> SVC[Microservicio]
    SVC --> DB
  end
  classDef public fill:#e8f5ff,stroke:#036,border:1px;
  classDef private fill:#f7f7f7,stroke:#666,border:1px;
  class A public;
  class B,DB,SVC private;
\`\`\``;

    const currentContent = form.getValues("content");
    const newContent = currentContent
      ? `${currentContent}\n\n${example}`
      : example;
    form.setValue("content", newContent);
    setMarkdownContent(newContent);
  };

  const copyContentToClipboard = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">
          {post ? "Editar artículo" : "Crear nuevo artículo"}
        </h1>
        {post && (
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={handleTitleChange}
                      placeholder="Mi artículo increíble"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="mi-articulo-increible"
                      onChange={(e) => {
                        const slug = generateSlug(e.target.value);
                        field.onChange(slug);
                      }}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumen</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Breve resumen del artículo"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <BlogImageUpload
                    postId={post?.id || tempPostId}
                    currentImageUrl={field.value}
                    onUploadComplete={handleImageUploadComplete}
                    onUploadError={handleImageUploadError}
                    label="Imagen de portada"
                    description="Sube una imagen de portada para tu artículo. Tamaño máximo 5MB."
                  />
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Synchronize published status with the status field
                        form.setValue(
                          "published",
                          value === BlogPostStatus.PUBLISHED
                        );
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={BlogPostStatus.DRAFT}>
                          Borrador
                        </SelectItem>
                        <SelectItem value={BlogPostStatus.PUBLISHED}>
                          Publicado
                        </SelectItem>
                        <SelectItem value={BlogPostStatus.ARCHIVED}>
                          Archivado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <FormLabel>Contenido</FormLabel>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={insertMermaidExample}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Insertar diagrama Mermaid
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={copyContentToClipboard}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {isCopied ? "¡Copiado!" : "Copiar"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copiar contenido al portapapeles</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <Tabs
              defaultValue="rich-editor"
              className="w-full"
              value={activeTab}
              onValueChange={handleTabChange}
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="rich-editor">Editor</TabsTrigger>
                <TabsTrigger value="preview">Vista previa</TabsTrigger>
              </TabsList>

              <TabsContent value="rich-editor" className="mt-2">
                <EnhancedEditor
                  content={content}
                  onChange={(newContent) => {
                    form.setValue("content", newContent);
                    setContent(newContent);
                    setMarkdownContent(newContent);
                  }}
                  placeholder="Comienza a escribir el contenido de tu artículo aquí..."
                />
              </TabsContent>

              <TabsContent
                value="preview"
                className="mt-2 prose dark:prose-invert max-w-none"
              >
                <div className="p-4 border rounded-md min-h-[500px] overflow-auto bg-background">
                  <MarkdownWithMermaid>{markdownContent}</MarkdownWithMermaid>
                </div>
              </TabsContent>
            </Tabs>

            <FormMessage />
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              {post ? "Actualizar artículo" : "Crear artículo"}
            </Button>
          </div>
        </form>
      </Form>

      {post && (
        <DeleteBlogPostAlertDialog
          blogPostId={post.id}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        />
      )}
    </div>
  );
}
