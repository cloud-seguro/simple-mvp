"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import { useRouter } from "next/navigation";
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
import { PasswordInput } from "@/components/utils/password-input";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/auth-provider";

// Schema for the form
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [isValidResetLink, setIsValidResetLink] = useState(true);
  const { checkPasswordStrength } = useAuth();
  // const router = useRouter();
  const supabase = createClientComponentClient();

  // Password strength state
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    numbers: false,
    special: false,
  });

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Check if this is a valid password reset session
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        setIsValidResetLink(false);
        console.error("Invalid reset link or session expired:", error);
      }
    };

    checkSession();
  }, [supabase.auth]);

  // Check password strength when password changes
  useEffect(() => {
    const password = form.watch("password");
    if (password) {
      checkPasswordStrength(password).then((result) => {
        setPasswordRequirements(result.requirements);
      });
    }
  }, [checkPasswordStrength, form]);

  async function onSubmit(data: ResetPasswordFormData) {
    try {
      setIsLoading(true);

      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        throw error;
      }

      // Show success message
      setResetComplete(true);
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada correctamente.",
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Error",
        description: "No pudimos actualizar tu contraseña. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // If the reset link is invalid or expired, show error message
  if (!isValidResetLink) {
    return (
      <div className="flex flex-col space-y-4 text-center">
        <p className="text-red-500">
          El enlace de restablecimiento no es válido o ha expirado.
        </p>
        <p className="text-sm text-muted-foreground">
          Por favor, solicita un nuevo enlace de restablecimiento.
        </p>
        <Button asChild className="mt-2">
          <Link href="/forgot-password">Solicitar nuevo enlace</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {resetComplete ? (
        <div className="flex flex-col space-y-4 text-center">
          <p>Tu contraseña ha sido actualizada correctamente.</p>
          <Button asChild className="mt-2">
            <Link href="/sign-in">Iniciar Sesión</Link>
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Nueva Contraseña</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="font-semibold">
                        Tu contraseña debe contener:
                      </p>
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4">
                        <li
                          className={
                            passwordRequirements.length ? "text-green-600" : ""
                          }
                        >
                          Al menos 8 caracteres
                        </li>
                        <li
                          className={
                            passwordRequirements.uppercase
                              ? "text-green-600"
                              : ""
                          }
                        >
                          Una letra mayúscula
                        </li>
                        <li
                          className={
                            passwordRequirements.lowercase
                              ? "text-green-600"
                              : ""
                          }
                        >
                          Una letra minúscula
                        </li>
                        <li
                          className={
                            passwordRequirements.numbers ? "text-green-600" : ""
                          }
                        >
                          Un número
                        </li>
                        <li
                          className={
                            passwordRequirements.special ? "text-green-600" : ""
                          }
                        >
                          Un carácter especial
                        </li>
                      </ul>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-2" disabled={isLoading}>
                {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
