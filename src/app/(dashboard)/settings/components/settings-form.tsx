"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";
import { UserRole } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";

const settingsFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .optional(),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .optional(),
  email: z.string().email("Email inválido").optional(),
  phoneNumber: z.string().optional(),
  company: z.string().optional(),
  company_role: z.string().optional(),
  avatarUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  active: z.boolean().default(true),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export function SettingsForm() {
  const { profile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: profile?.email || "",
      phoneNumber: profile?.phoneNumber || "",
      company: profile?.company || "",
      company_role: profile?.company_role || "",
      avatarUrl: profile?.avatarUrl || "",
      active: profile?.active ?? true,
    },
  });

  // Update form values when profile changes
  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        company: profile.company || "",
        company_role: profile.company_role || "",
        avatarUrl: profile.avatarUrl || "",
        active: profile.active ?? true,
      });
    }
  }, [profile, form]);

  async function onSubmit(data: SettingsFormValues) {
    if (isSubmitting || !user) return;

    try {
      setIsSubmitting(true);
      setLoadingMessage("Actualizando configuración...");

      // Add a small delay to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Retry logic for updating profile
      let success = false;
      let retryCount = 0;
      const maxRetries = 3;
      let lastError = null;

      while (!success && retryCount < maxRetries) {
        try {
          setLoadingMessage(
            `Actualizando perfil (intento ${retryCount + 1}/${maxRetries})...`
          );

          const response = await fetch("/api/profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phoneNumber: data.phoneNumber,
              company: data.company,
              company_role: data.company_role,
              avatarUrl: data.avatarUrl,
              active: data.active,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al actualizar el perfil");
          }

          success = true;
        } catch (error) {
          console.error(`Attempt ${retryCount + 1} failed:`, error);
          lastError = error;
          retryCount++;

          if (retryCount < maxRetries) {
            // Wait before retrying (increasing delay with each retry)
            setLoadingMessage(
              `Reintentando actualización (${retryCount}/${maxRetries})...`
            );
            // Exponential backoff for retries
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * 1.5 ** retryCount)
            );
          }
        }
      }

      if (!success) {
        throw (
          lastError ||
          new Error("Failed to update profile after multiple attempts")
        );
      }

      // Refresh the profile data in the auth context to update UI across the app
      await refreshProfile();

      toast({
        title: "Configuración actualizada",
        description: "Tu información ha sido actualizada correctamente.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar la configuración. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setLoadingMessage("");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-center text-muted-foreground">
              {loadingMessage || "Procesando..."}
            </p>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tu información personal y de contacto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu apellido" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu número de teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información Profesional</CardTitle>
              <CardDescription>
                Actualiza tu información profesional
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de tu empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company_role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu cargo en la empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de Rol</CardTitle>
              <CardDescription>
                Información sobre tu tipo de cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Rol:</span>
                <span className="text-sm text-muted-foreground">
                  {profile?.role === UserRole.FREE && "Usuario Gratuito"}
                  {profile?.role === UserRole.PREMIUM && "Usuario Premium"}
                  {profile?.role === UserRole.SUPERADMIN && "Administrador"}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-20 border-t-white"></span>
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
