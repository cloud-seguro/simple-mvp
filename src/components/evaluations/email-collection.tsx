"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { validateCorporateEmail } from "@/lib/utils/email-validation";
import { toast } from "@/components/ui/use-toast";
import { AnimatedSecuritySVG } from "@/components/ui/animated-security-svg";
import { SimpleHeader } from "@/components/ui/simple-header";
import { AlertTriangle } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email("Email inválido").min(1, "El email es requerido"),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface EmailCollectionProps {
  onEmailSubmit: (email: string) => Promise<void>;
}

export function EmailCollection({ onEmailSubmit }: EmailCollectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
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

  const onSubmit = async (data: EmailFormData) => {
    if (emailError) return;

    try {
      setIsSubmitting(true);
      await onEmailSubmit(data.email);
    } catch (error) {
      console.error("Error submitting email:", error);
      toast({
        title: "Error",
        description:
          "No pudimos procesar tu email. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Left sidebar */}
      <div className="bg-[#FFD700] w-full md:w-2/5 p-2 md:p-4 flex flex-col">
        <div className="flex justify-start">
          <SimpleHeader className="hover:opacity-80 transition-opacity" />
        </div>
        <div className="flex-grow flex items-center justify-center py-8 md:py-0">
          <AnimatedSecuritySVG />
        </div>
      </div>

      {/* Right content */}
      <div className="w-full md:w-3/5 p-4 md:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Bienvenido a la Evaluación
          </h1>
          <p className="text-base md:text-lg text-gray-700">
            Antes de comenzar, necesitamos su correo electrónico corporativo
            para enviarle los resultados y recomendaciones personalizadas.
          </p>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico Corporativo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="tu@empresa.com"
                          {...field}
                          className={emailError ? "border-red-500" : ""}
                        />
                      </FormControl>
                      {emailError && (
                        <div className="flex items-center gap-2.5 mt-2 p-3 bg-red-50 border border-red-200 rounded-md shadow-sm animate-in fade-in duration-200">
                          <div className="p-1 bg-red-100 rounded-full">
                            <AlertTriangle className="h-3.5 w-3.5 text-red-600 flex-shrink-0" />
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

                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-800 rounded-full"
                  disabled={isSubmitting || !!emailError || isCheckingEmail}
                >
                  {isSubmitting
                    ? "Enviando..."
                    : isCheckingEmail
                      ? "Verificando correo..."
                      : "Continuar"}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-2">
                  Usamos su correo corporativo para garantizar que la
                  información llegue a su organización. No compartimos sus datos
                  con terceros.
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
