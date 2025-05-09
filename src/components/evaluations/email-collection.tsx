"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

  const handleEmailChange = async (email: string) => {
    form.setValue("email", email);

    // Clear previous error
    setEmailError(null);

    if (!email || !form.formState.isValid) return;

    try {
      setIsCheckingEmail(true);

      // Validate email format
      const result = validateCorporateEmail(email);
      if (!result.isValid) {
        setEmailError(
          result.reason || "Dirección de correo electrónico no válida"
        );
        return;
      }
    } catch (error) {
      console.error("Error validating email:", error);
    } finally {
      setIsCheckingEmail(false);
    }
  };

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
            Antes de comenzar, necesitamos su correo electrónico para enviarle
            los resultados y recomendaciones personalizadas.
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
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="tu@empresa.com"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleEmailChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      {emailError ? (
                        <p className="text-sm font-medium text-destructive">
                          {emailError}
                        </p>
                      ) : (
                        <FormMessage />
                      )}
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
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
