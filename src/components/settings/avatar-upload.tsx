"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { uploadAvatar } from "@/lib/supabase/upload-avatar";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string | null;
  onUploadComplete: (url: string) => void;
  onUploadError: (error: Error) => void;
}

export function AvatarUpload({ 
  userId, 
  currentAvatarUrl, 
  onUploadComplete,
  onUploadError 
}: AvatarUploadProps) {
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
      const avatarUrl = await uploadAvatar(file, userId);
      onUploadComplete(avatarUrl);
    } catch (error) {
      onUploadError(error as Error);
      // Reset preview on error
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormItem>
      <FormLabel>Profile Picture</FormLabel>
      <FormControl>
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24">
            {(preview || currentAvatarUrl) ? (
              <Image
                src={preview || currentAvatarUrl || ""}
                alt="Avatar preview"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <Camera className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </div>
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
          >
            {isUploading ? "Uploading..." : "Change Picture"}
          </Button>
        </div>
      </FormControl>
      <FormDescription>
        Choose a profile picture. Max size 2MB.
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
} 