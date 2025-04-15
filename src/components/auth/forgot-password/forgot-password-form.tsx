"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
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
import { toast } from "@/components/ui/use-toast";

// URL helper function (same as in auth-provider.tsx)
const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

// Schema for the form
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El correo electrónico es requerido" })
    .email({ message: "Correo electrónico inválido" }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const supabase = createClientComponentClient();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    try {
      setIsLoading(true);

      // Call Supabase to send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${getURL()}auth/callback`,
      });

      if (error) {
        throw error;
      }

      // Show success message
      setEmailSent(true);
      toast({
        title: "Correo enviado",
        description:
          "Revisa tu bandeja de entrada para continuar con el proceso.",
      });
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast({
        title: "Error",
        description:
          "No pudimos enviar el correo de recuperación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      {emailSent ? (
        <div className="flex flex-col space-y-4 text-center">
          <p>
            Hemos enviado un correo a tu dirección de email con instrucciones
            para restablecer tu contraseña.
          </p>
          <p className="text-sm text-muted-foreground">
            No olvides revisar tu carpeta de spam si no lo encuentras en tu
            bandeja de entrada.
          </p>
          <Button asChild className="mt-2">
            <Link href="/sign-in">Volver a Iniciar Sesión</Link>
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="nombre@ejemplo.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col space-y-2 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar Instrucciones"}
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Volver a Iniciar Sesión</Link>
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
