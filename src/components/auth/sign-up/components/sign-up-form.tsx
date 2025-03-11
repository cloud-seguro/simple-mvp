'use client'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
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
import type { SignUpFormProps, SignUpFormData } from "@/types/auth/sign-up";
import { signUpFormSchema } from "@/types/auth/sign-up";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
import { uploadAvatar } from "@/lib/supabase/upload-avatar";
import { useRouter } from "next/navigation";

// Extended props to include evaluation results
interface ExtendedSignUpFormProps extends SignUpFormProps {
  onSignUpComplete?: (userId: string) => Promise<void>;
  evaluationResults?: {
    quizId: string;
    results: Record<string, number>;
  };
}

export function SignUpForm({ 
  className, 
  onSignUpComplete,
  evaluationResults,
  ...props 
}: ExtendedSignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const router = useRouter();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      company: "",
      company_role: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: SignUpFormData) {
    try {
      setIsLoading(true);
      setLoadingMessage("Creando cuenta...");

      const { success, user, session, error } = await signUp(
        data.email,
        data.password
      );

      if (!success || error || !session) {
        throw error || new Error("Failed to sign up");
      }

      if (user) {
        setLoadingMessage("Subiendo avatar...");
        let avatarUrl = null;
        if (avatarFile) {
          try {
            avatarUrl = await uploadAvatar(avatarFile, user.id);
          } catch (error) {
            console.error("Avatar upload failed:", error);
            toast({
              title: "Advertencia",
              description:
                "No se pudo subir el avatar, puedes agregarlo más tarde desde tu perfil.",
              variant: "default",
            });
          }
        }

        try {
          setLoadingMessage("Creando perfil...");
          // Create user profile
          const profileResponse = await fetch("/api/profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              company: data.company,
              company_role: data.company_role,
              avatarUrl,
            }),
          });

          const profileData = await profileResponse.json();

          if (!profileResponse.ok) {
            throw new Error(
              profileData.error ||
                `Error al crear perfil: ${profileResponse.status}`
            );
          }

          // If we're in the evaluation flow, skip profile verification
          if (evaluationResults && onSignUpComplete) {
            setLoadingMessage("Guardando resultados de evaluación...");
            await onSignUpComplete(user.id);
          } else {
            // Only verify profile if we're not in the evaluation flow
            let profileExists = false;
            let retryCount = 0;
            const maxRetries = 5;

            setLoadingMessage("Verificando perfil...");
            while (!profileExists && retryCount < maxRetries) {
              try {
                // Increased delay before checking (1 second)
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Check if profile exists
                const checkResponse = await fetch(`/api/profile/${user.id}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });

                if (checkResponse.ok) {
                  profileExists = true;
                } else if (checkResponse.status === 404) {
                  // Silently continue if 404, this is expected
                  retryCount++;
                } else {
                  // Only log error for non-404 responses
                  const errorData = await checkResponse.json();
                  console.error("Error checking profile:", errorData);
                  retryCount++;
                }
              } catch (e) {
                // Only log error if it's not a 404
                if (e instanceof Error && !e.message.includes("404")) {
                  console.error("Error checking profile:", e);
                }
                retryCount++;
              }
            }

            if (!profileExists) {
              // Changed to debug level since this is expected sometimes
              console.debug("Profile verification timeout, but continuing");
            }
          }

          toast({
            title: "Éxito",
            description: "Tu cuenta ha sido creada correctamente.",
          });

          // If we're coming from an evaluation, don't redirect automatically
          if (!evaluationResults) {
            // Add a small delay before redirecting to ensure profile is available
            setLoadingMessage("Redirigiendo al dashboard...");
            setTimeout(() => {
              router.push("/dashboard");
            }, 1000);
          }
        } catch (profileError) {
          console.error("Profile creation error:", profileError);

          // If profile creation fails, we should still show a toast
          toast({
            title: "Error",
            description:
              profileError instanceof Error
                ? profileError.message
                : "Error al crear perfil. Por favor, inténtalo de nuevo.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Sign up error:", error);
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
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-24 w-24">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar preview"
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                  <UploadCloud className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full max-w-xs"
            />
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan" {...field} />
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
                    <Input placeholder="Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la empresa" {...field} />
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? loadingMessage || "Procesando..." : "Crear Cuenta"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
