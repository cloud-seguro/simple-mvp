"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud } from "lucide-react";
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
import { PasswordStrengthIndicator } from "@/components/utils/password-strength-indicator";
import type { SignUpFormProps, SignUpFormData } from "@/types/auth/sign-up";
import { signUpFormSchema } from "@/types/auth/sign-up";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Extended props to include evaluation results
interface ExtendedSignUpFormProps extends SignUpFormProps {
  onSignUpComplete?: (userId: string) => Promise<void>;
  onSignUpStart?: () => void;
  // These props are not currently used but kept for future implementation
  onProfileCreationStart?: () => void;
  evaluationResults?: {
    quizId: string;
    results: Record<string, number>;
  };
}

export function SignUpForm({
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSignUpComplete,
  onSignUpStart,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onProfileCreationStart,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  evaluationResults,
  ...props
}: ExtendedSignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, checkPasswordStrength } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    numbers: false,
    special: false,
  });
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

  // Check password strength when password changes
  useEffect(() => {
    const checkStrength = async () => {
      if (passwordValue) {
        const result = await checkPasswordStrength(passwordValue);
        setPasswordStrength(result.strength);
        setPasswordRequirements(result.requirements);
      } else {
        setPasswordStrength(0);
        setPasswordRequirements({
          length: false,
          uppercase: false,
          lowercase: false,
          numbers: false,
          special: false,
        });
      }
    };

    checkStrength();
  }, [passwordValue, checkPasswordStrength]);

  async function onSubmit(data: SignUpFormData) {
    try {
      setIsLoading(true);
      setLoadingMessage("Creando cuenta...");

      // Notify parent component that sign-up has started
      if (onSignUpStart) {
        onSignUpStart();
      }

      // Extract profile data from form
      const profileData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        company: data.company,
        company_role: data.company_role,
      };

      // Call the signUp function from the auth provider with profile data
      // This will handle email verification and profile creation
      await signUp(data.email, data.password, profileData);

      // If we have an avatar file, save for later processing
      if (avatarFile) {
        // Store reference to the avatar but we'll need a separate mechanism to upload it
        // since we can't pass File objects to the API in the initial request
        localStorage.setItem("hasAvatarPending", "true");
      }

      // Show success message
      toast({
        title: "Cuenta creada",
        description:
          "Por favor, verifica tu correo electrónico para completar el registro.",
        variant: "default",
      });

      setIsLoading(false);

      // Redirect to sign-in page or a custom page instructing them to check email
      router.push("/auth/verify-email");
    } catch (error) {
      console.error("Error in form submission:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Ha ocurrido un error.",
        variant: "destructive",
      });
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
                <PasswordStrengthIndicator
                  password={passwordValue}
                  strength={passwordStrength}
                  requirements={passwordRequirements}
                />
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
