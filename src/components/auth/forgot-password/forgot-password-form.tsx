"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

// Schema for the form
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Ingresa un correo electrónico válido" }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
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

      console.log("Sending password reset email to:", data.email);

      // Use auth/reset-password for PKCE flow
      // This server route will handle the code exchange
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error("Reset password error:", error);
        throw error;
      }

      // Show success message, even if email doesn't exist for security
      setResetSent(true);
      toast({
        title: "Correo enviado",
        description:
          "Si existe una cuenta con este correo, recibirás un enlace para restablecer tu contraseña.",
      });
    } catch (error) {
      console.error("Error sending reset email:", error);

      // Always show success for security reasons (don't reveal if email exists)
      setResetSent(true);
      toast({
        title: "Correo enviado",
        description:
          "Si existe una cuenta con este correo, recibirás un enlace para restablecer tu contraseña.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      {resetSent ? (
        <div className="flex flex-col space-y-4 text-center">
          <p>
            Hemos enviado un correo con instrucciones para restablecer tu
            contraseña.
          </p>
          <p className="text-sm text-muted-foreground">
            Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
          </p>
          <Button asChild variant="outline" className="mt-2">
            <Link href="/sign-in">Volver a iniciar sesión</Link>
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="nombre@ejemplo.com"
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-2" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
