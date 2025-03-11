"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
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
import { PasswordInput } from "@/components/utils/password-input";
import type { SignInFormData } from "@/types/auth/sign-in";
import { signInFormSchema } from "@/types/auth/sign-in";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface SignInFormProps {
  className?: string;
}

// Extended props to include evaluation results
interface ExtendedSignInFormProps extends SignInFormProps {
  onSignInComplete?: (userId: string) => Promise<void>;
  onSignInStart?: () => void;
  evaluationResults?: {
    quizId: string;
    results: Record<string, number>;
  };
}

export function SignInForm({
  className,
  onSignInComplete,
  onSignInStart,
  evaluationResults,
  ...props
}: ExtendedSignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInFormData) {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setLoadingMessage("Iniciando sesión...");

      // Notify parent component that sign-in has started
      if (onSignInStart) {
        onSignInStart();
      }

      // Sign in and wait for it to complete
      await signIn(data.email, data.password, !!evaluationResults);

      // Wait longer to ensure session and profile are properly set
      setLoadingMessage("Cargando perfil...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // If we have evaluation results and onSignInComplete, call it
      if (evaluationResults && onSignInComplete) {
        setLoadingMessage("Preparando para guardar resultados...");
        try {
          // Get the current user ID from a fresh call to useAuth
          const currentUser = await fetch("/api/auth/me").then((res) =>
            res.json()
          );

          if (!currentUser?.id) {
            throw new Error("No se pudo obtener la información del usuario");
          }

          setLoadingMessage("Guardando resultados de evaluación...");
          await onSignInComplete(currentUser.id);

          toast({
            title: "Éxito",
            description:
              "Has iniciado sesión correctamente y tus resultados han sido guardados.",
          });
        } catch (evalError) {
          console.error("Error saving evaluation:", evalError);
          toast({
            title: "Advertencia",
            description:
              "Hubo un problema al guardar los resultados, pero puede continuar.",
            variant: "default",
          });

          // Still proceed even if there was an error
          if (onSignInComplete) {
            try {
              const currentUser = await fetch("/api/auth/me").then((res) =>
                res.json()
              );
              if (currentUser?.id) {
                await onSignInComplete(currentUser.id);
              }
            } catch (retryError) {
              console.error("Error in retry attempt:", retryError);
            }
          }
        }
      } else {
        toast({
          title: "Éxito",
          description: "Has iniciado sesión correctamente.",
        });

        // If we're coming from an evaluation, don't redirect automatically
        if (!evaluationResults) {
          setLoadingMessage("Redirigiendo al dashboard...");
          // Add a small delay before redirecting
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Algo salió mal. Por favor, inténtalo de nuevo.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoadingMessage("");
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin" />
              <p className="text-lg font-medium">
                {loadingMessage || "Procesando..."}
              </p>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input placeholder="nombre@ejemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? loadingMessage || "Procesando..." : "Iniciar Sesión"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
