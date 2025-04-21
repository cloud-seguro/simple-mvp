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
import { YooptaEditorComponent } from "./yoopta-editor";
import "@/styles/yoopta.css";
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
      published: post?.published || false,
      tags: post?.tags || [],
      description: post?.description || "",
      featuredImage: post?.featuredImage || "",
      status: post?.status || BlogPostStatus.DRAFT,
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

  // When content changes, update the markdown preview
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    form.setValue("content", value);
    setContent(value);
    setMarkdownContent(value);
  };

  // Handle rich editor content change
  const handleRichEditorChange = (newContent: string) => {
    form.setValue("content", newContent);
    setContent(newContent);
    setMarkdownContent(newContent);
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
          {post ? "Edit Blog Post" : "Create New Blog Post"}
        </h1>
        {post && (
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
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
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={handleTitleChange}
                      placeholder="My Awesome Blog Post"
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
                      placeholder="my-awesome-blog-post"
                      onChange={(e) => {
                        const slug = generateSlug(e.target.value);
                        form.setValue("slug", slug);
                      }}
                      value={form.getValues("slug")}
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
                name="featuredImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://example.com/image.jpg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={BlogPostStatus.DRAFT}>
                          Draft
                        </SelectItem>
                        <SelectItem value={BlogPostStatus.PUBLISHED}>
                          Published
                        </SelectItem>
                        <SelectItem value={BlogPostStatus.ARCHIVED}>
                          Archived
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
              <FormLabel>Content</FormLabel>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={insertMermaidExample}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Insert Mermaid Diagram
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
                        {isCopied ? "Copied!" : "Copy"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy content to clipboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <Tabs
              defaultValue="editor"
              className="w-full"
              value={activeTab}
              onValueChange={handleTabChange}
            >
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="editor">Markdown</TabsTrigger>
                <TabsTrigger value="rich-editor">Rich Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="mt-2">
                <Textarea
                  value={content}
                  onChange={(e) => handleContentChange(e)}
                  className="min-h-[500px] font-mono"
                  placeholder="# My Awesome Blog Post

Write your content here using Markdown syntax.

## Features
- Support for **bold text**
- Support for *italic text*
- Support for `code blocks`
- Support for [links](https://example.com)
- Support for images ![alt text](https://example.com/image.jpg)
- Support for Mermaid diagrams
                  "
                />
              </TabsContent>

              <TabsContent value="rich-editor" className="mt-2">
                <YooptaEditorComponent
                  content={content}
                  onChange={handleRichEditorChange}
                  placeholder="Start typing your blog post content here..."
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
              {post ? "Update Blog Post" : "Create Blog Post"}
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
