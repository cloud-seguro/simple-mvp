"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { profileFormSchema } from "@/lib/validations/profile";
import type { ProfileFormValues } from "@/lib/validations/profile";

export function ProfileForm() {
  const { profile, user } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<ProfileFormValues | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: profile?.username || "",
      fullName: profile?.fullName || "",
      bio: profile?.bio || "",
    },
  });

  async function handleSubmit(data: ProfileFormValues) {
    setPendingChanges(data);
    setShowConfirmDialog(true);
  }

  async function handleConfirmUpdate() {
    if (!pendingChanges || !profile?.userId) return;

    try {
      const response = await fetch(`/api/profile/${profile.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingChanges),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      // Reset form with new values
      form.reset(pendingChanges);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowConfirmDialog(false);
      setPendingChanges(null);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or a pseudonym.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can @mention other users and organizations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-4">
            <Button type="submit">Update profile</Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => form.reset()}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmUpdate}
        title="Update Profile"
        description="Are you sure you want to update your profile? This action cannot be undone."
      />
    </>
  );
} 