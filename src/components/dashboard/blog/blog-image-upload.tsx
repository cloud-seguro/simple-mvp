"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { uploadBlogImage } from "@/lib/supabase/upload-blog-image";

interface BlogImageUploadProps {
  postId: string;
  currentImageUrl?: string | null;
  onUploadComplete: (url: string) => void;
  onUploadError: (error: Error) => void;
  label?: string;
  description?: string;
}

export function BlogImageUpload({
  postId,
  currentImageUrl,
  onUploadComplete,
  onUploadError,
  label = "Imagen de portada",
  description = "Sube una imagen de portada para tu artículo. Tamaño máximo 5MB.",
}: BlogImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      setIsUploading(true);
      const imageUrl = await uploadBlogImage(file, postId);
      onUploadComplete(imageUrl);
    } catch (error) {
      onUploadError(error as Error);
      // Reset preview on error
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onUploadComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="space-y-4">
          {(preview || currentImageUrl) && (
            <div className="relative aspect-video w-full max-h-[300px] overflow-hidden rounded-md border">
              <Image
                src={preview || currentImageUrl || ""}
                alt="Blog image preview"
                fill
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={clearImage}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {preview || currentImageUrl
                    ? "Cambiar imagen"
                    : "Subir imagen"}
                </>
              )}
            </Button>
          </div>
        </div>
      </FormControl>
      <FormDescription>{description}</FormDescription>
      <FormMessage />
    </FormItem>
  );
}
