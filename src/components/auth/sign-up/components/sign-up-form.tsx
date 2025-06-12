"use client";
import { useState, useEffect } from "react";
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
import { PasswordStrengthIndicator } from "@/components/utils/password-strength-indicator";
import type { SignUpFormProps, SignUpFormData } from "@/types/auth/sign-up";
import { signUpFormSchema } from "@/types/auth/sign-up";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { TriangleAlert, Loader2 } from "lucide-react";
import { validateCorporateEmail } from "@/lib/utils/email-validation";

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
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
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

  // Real-time email validation when the email field changes
  const emailValue = form.watch("email");
  useEffect(() => {
    const validateEmail = async () => {
      if (emailValue && emailValue.includes("@") && emailValue.includes(".")) {
        // Basic format check first
        setIsCheckingEmail(true);
        setEmailError(null);

        try {
          // Client-side validation
          const localValidation = validateCorporateEmail(emailValue);

          if (!localValidation.isValid) {
            setEmailError(
              localValidation.reason || "Correo electrónico no válido"
            );
            return;
          }

          // Server-side validation for extra security
          const response = await fetch("/api/auth/validate-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: emailValue }),
          });

          const data = await response.json();

          if (!data.isValid) {
            setEmailError(data.reason || "Correo electrónico no válido");
          } else {
            setEmailError(null);
          }
        } catch (error) {
          console.error("Error validating email:", error);
        } finally {
          setIsCheckingEmail(false);
        }
      }
    };

    // Use a debounce to avoid too many API calls
    const debounceTimeout = setTimeout(validateEmail, 500);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [emailValue]);

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
      // Prevent form submission if there's an email error
      if (emailError) {
        toast({
          title: "Error",
          description: emailError,
          variant: "destructive",
        });
        return;
      }

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

      // Show success message
      toast({
        title: "Cuenta creada",
        description:
          "Por favor, verifica tu correo electrónico para completar el registro.",
        variant: "default",
      });

      setIsLoading(false);

      // Redirect to verify-email page with email as query parameter
      router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input
                    placeholder="nombre@empresa.com"
                    {...field}
                    className={emailError ? "border-red-500" : ""}
                  />
                </FormControl>
                {emailError && (
                  <div className="flex items-center gap-2.5 mt-2 p-3 bg-red-50 border border-red-200 rounded-md shadow-sm animate-in fade-in duration-200">
                    <div className="p-1 bg-red-100 rounded-full">
                      <TriangleAlert className="h-3.5 w-3.5 text-red-600 flex-shrink-0" />
                    </div>
                    <span className="text-sm text-red-700 font-medium">
                      {emailError}
                    </span>
                  </div>
                )}
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

          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading ||
              passwordStrength < 3 ||
              !!emailError ||
              isCheckingEmail
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingMessage || "Registrando..."}
              </>
            ) : (
              "Crear cuenta"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
