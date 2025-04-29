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

const emailSchema = z.object({
  email: z.string().email("Email inválido").min(1, "El email es requerido"),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface EmailCollectionProps {
  onEmailSubmit: (email: string) => Promise<void>;
  onSkip?: () => void;
}

export function EmailCollection({
  onEmailSubmit,
  onSkip,
}: EmailCollectionProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-4">¡Felicitaciones!</h1>
      <p className="mb-6">
        Has completado la evaluación. Ingresa tu correo electrónico para recibir
        los resultados completos.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md">
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
              className="w-full"
              disabled={isSubmitting || !!emailError || isCheckingEmail}
            >
              {isSubmitting
                ? "Enviando..."
                : isCheckingEmail
                  ? "Verificando correo..."
                  : "Ver Resultados"}
            </Button>
          </form>
        </Form>
      </div>
    </motion.div>
  );
}
