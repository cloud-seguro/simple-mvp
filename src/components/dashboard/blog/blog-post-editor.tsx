"use client";

import { useState, useEffect, useRef } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { generateSlug } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { BlogImageUpload } from "./blog-image-upload";

// Define the form schema
const blogPostSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  slug: z.string().min(1, "El slug es obligatorio"),
  excerpt: z.string().min(1, "El resumen es obligatorio"),
  coverImage: z.string().optional(),
  content: z.string().min(1, "El contenido es obligatorio"),
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

// Define the props for the component
interface BlogPostEditorProps {
  post: any | null; // The post to edit, null if creating a new post
  authorId: string; // The ID of the current user
}

export function BlogPostEditor({ post, authorId }: BlogPostEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [tempPostId, setTempPostId] = useState<string>("");

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
      published: post?.published || false,
      tags: post?.tags || [],
    },
  });

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

  // When content changes, update the markdown preview
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    form.setValue("content", value);
    setMarkdownContent(value);
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
    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Título del artículo"
                      onChange={handleTitleChange}
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
                  <FormLabel>URL del artículo (slug)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="url-del-articulo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <BlogImageUpload
                  postId={post?.id || tempPostId}
                  currentImageUrl={field.value}
                  onUploadComplete={handleImageUploadComplete}
                  onUploadError={handleImageUploadError}
                />
              )}
            />
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Publicar</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          {field.value
                            ? "El artículo será visible públicamente"
                            : "El artículo se guardará como borrador"}
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/blog")}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Guardando..."
                      : post
                        ? "Actualizar"
                        : "Crear"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="border rounded-md">
          <Tabs
            defaultValue="editor"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full justify-start px-2 pt-2 bg-transparent">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Vista previa</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="p-0 border-t">
              <div className="min-h-[500px]">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[500px] p-4 font-mono resize-none"
                          placeholder="# Contenido del artículo en Markdown"
                          onChange={handleContentChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            <TabsContent value="preview" className="p-6 border-t">
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {markdownContent}
                </ReactMarkdown>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </Form>
  );
}
