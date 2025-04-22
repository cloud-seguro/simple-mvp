"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface DeleteBlogPostAlertDialogProps {
  blogPostId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteBlogPostAlertDialog({
  blogPostId,
  open,
  onOpenChange,
}: DeleteBlogPostAlertDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/blog/${blogPostId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete blog post");
      }

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });

      // Redirect to blog management
      router.push("/dashboard/blog");
      router.refresh();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as Error).message ||
          "An error occurred while deleting the blog post",
      });
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this blog post?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the blog
            post and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
