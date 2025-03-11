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
  evaluationResults?: {
    quizId: string;
    results: Record<string, number>;
  };
}

export function SignInForm({
  className,
  onSignInComplete,
  evaluationResults,
  ...props
}: ExtendedSignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user } = useAuth();
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

      // Sign in and wait for it to complete
      await signIn(data.email, data.password);

      // Wait a moment to ensure session is properly set
      await new Promise((resolve) => setTimeout(resolve, 500));

      // If we have evaluation results and the user is set, save them
      if (evaluationResults && onSignInComplete && user?.id) {
        setLoadingMessage("Guardando resultados de evaluación...");
        try {
          await onSignInComplete(user.id);
        } catch (evalError) {
          console.error("Error saving evaluation:", evalError);
          throw new Error("Error al guardar los resultados de la evaluación");
        }
      }

      toast({
        title: "Éxito",
        description: "Has iniciado sesión correctamente.",
      });

      // If we're coming from an evaluation, don't redirect automatically
      if (!evaluationResults) {
        setLoadingMessage("Redirigiendo al dashboard...");
        // Add a small delay before redirecting
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.push("/dashboard");
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
