"use client";
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
import { PasswordStrengthIndicator } from "@/components/utils/password-strength-indicator";
import type { SignUpFormProps, SignUpFormData } from "@/types/auth/sign-up";
import { signUpFormSchema } from "@/types/auth/sign-up";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
import { uploadAvatar } from "@/lib/supabase/upload-avatar";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

// Extended props to include evaluation results
interface ExtendedSignUpFormProps extends SignUpFormProps {
  onSignUpComplete?: (userId: string) => Promise<void>;
  onSignUpStart?: () => void;
  onProfileCreationStart?: () => void;
  evaluationResults?: {
    quizId: string;
    results: Record<string, number>;
  };
}

export function SignUpForm({
  className,
  onSignUpComplete,
  onSignUpStart,
  onProfileCreationStart,
  evaluationResults,
  ...props
}: ExtendedSignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [passwordValue, setPasswordValue] = useState<string>("");
  const router = useRouter();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
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

      // Notify parent component that sign-up has started
      if (onSignUpStart) {
        onSignUpStart();
      }

      // Set a flag in localStorage to indicate we're in the process of creating a profile
      // This will be used by the AuthProvider to avoid premature profile fetching
      localStorage.setItem("creating_profile", "true");

      try {
        // Sign up the user
        await signUp(data.email, data.password);

        // Add a delay to allow the auth state to update
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Try to sign in with the credentials to get a valid user and session
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });

        if (signInError) {
          console.error("Sign in error after sign-up:", signInError);
          throw new Error("Failed to sign in after sign-up");
        }

        if (!signInData.user) {
          throw new Error("Failed to get user after sign-in");
        }

        // Use the user from the sign-in response
        const userId = signInData.user.id;

        console.log("Successfully signed in after sign-up, user ID:", userId);

        setLoadingMessage("Subiendo avatar...");
        let avatarUrl = null;
        if (avatarFile) {
          try {
            avatarUrl = await uploadAvatar(avatarFile, userId);
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
          // Notify parent component that profile creation has started
          if (onProfileCreationStart) {
            onProfileCreationStart();
          }

          setLoadingMessage("Creando perfil...");

          // Create user profile
          const profileResponse = await fetch("/api/profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phoneNumber: data.phoneNumber,
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

          // Add a delay after profile creation to ensure it's available
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Verify that the profile was created successfully
          setLoadingMessage("Verificando perfil...");
          let profileExists = false;
          let retryCount = 0;
          const maxRetries = 5;

          while (!profileExists && retryCount < maxRetries) {
            try {
              const checkResponse = await fetch(`/api/profile/${userId}`);

              if (checkResponse.ok) {
                const profileData = await checkResponse.json();
                if (profileData.profile) {
                  profileExists = true;
                  console.log(
                    "Profile verified successfully:",
                    profileData.profile
                  );
                }
              } else {
                console.log(
                  `Profile check attempt ${retryCount + 1} failed with status ${checkResponse.status}`
                );
              }
            } catch (error) {
              console.error(
                `Profile check attempt ${retryCount + 1} failed:`,
                error
              );
            }

            if (!profileExists) {
              retryCount++;
              if (retryCount < maxRetries) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }
            }
          }

          // Clear the creating_profile flag now that profile creation is complete
          localStorage.removeItem("creating_profile");

          // Add another delay to ensure the profile is fully available
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // If we're in the evaluation flow, call onSignUpComplete with the user ID
          if (evaluationResults && onSignUpComplete) {
            setLoadingMessage(
              "Preparando para guardar resultados de evaluación..."
            );
            try {
              await onSignUpComplete(userId);
            } catch (error) {
              console.error("Error in onSignUpComplete:", error);
              // Don't throw here, just log the error and continue
              toast({
                title: "Advertencia",
                description:
                  "Hubo un problema al guardar los resultados, pero puede continuar.",
                variant: "default",
              });
            }
          } else {
            // Only verify profile if we're not in the evaluation flow
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
          }
        } catch (profileError) {
          console.error("Profile creation error:", profileError);

          // Clear the creating_profile flag in case of error
          localStorage.removeItem("creating_profile");

          // If profile creation fails, we should still show a toast
          toast({
            title: "Error",
            description:
              profileError instanceof Error
                ? profileError.message
                : "Error al crear perfil. Por favor, inténtalo de nuevo.",
            variant: "destructive",
          });

          // If we're in the evaluation flow, still try to proceed
          if (evaluationResults && onSignUpComplete) {
            try {
              await onSignUpComplete(userId);
            } catch (error) {
              console.error(
                "Error in onSignUpComplete after profile creation failure:",
                error
              );
            }
          }
        }
      } catch (error) {
        // Clear the creating_profile flag in case of error
        localStorage.removeItem("creating_profile");
        throw error;
      }
    } catch (error) {
      console.error("Sign up error:", error);

      // Clear the creating_profile flag in case of error
      localStorage.removeItem("creating_profile");

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
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="555-555-5555" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  <PasswordInput
                    placeholder="********"
                    {...field}
                    disabled={isLoading}
                    onChange={(e) => {
                      field.onChange(e);
                      setPasswordValue(e.target.value);
                    }}
                  />
                </FormControl>
                <PasswordStrengthIndicator password={passwordValue} />
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
