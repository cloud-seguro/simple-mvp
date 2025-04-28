import { z } from "zod";
import {
  isConsumerEmail,
  isDisposableEmail,
} from "@/lib/utils/email-validation";

export const signUpFormSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Dirección de correo electrónico inválida" })
      .refine((email) => !isDisposableEmail(email), {
        message: "No se permiten correos temporales o desechables",
      })
      .refine((email) => !isConsumerEmail(email), {
        message: "Por favor utiliza un correo corporativo",
      }),
    firstName: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
      .max(30, { message: "El nombre no puede exceder 30 caracteres" })
      .optional(),
    lastName: z
      .string()
      .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
      .max(30, { message: "El apellido no puede exceder 30 caracteres" })
      .optional(),
    phoneNumber: z
      .string()
      .min(6, {
        message: "El número de teléfono debe tener al menos 10 dígitos",
      })
      .max(15, { message: "El número de teléfono no puede exceder 15 dígitos" })
      .regex(/^\+?[1-9]\d{1,14}$/, { message: "Número de teléfono inválido" })
      .optional(),
    company: z
      .string()
      .max(50, {
        message: "El nombre de la empresa no puede exceder 50 caracteres",
      })
      .optional(),
    company_role: z
      .string()
      .max(50, { message: "El cargo no puede exceder 50 caracteres" })
      .optional(),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
      .regex(/[A-Z]/, { message: "Debe incluir al menos una letra mayúscula" })
      .regex(/[a-z]/, { message: "Debe incluir al menos una letra minúscula" })
      .regex(/[0-9]/, { message: "Debe incluir al menos un número" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Debe incluir al menos un caracter especial",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export type SignUpFormProps = React.HTMLAttributes<HTMLDivElement>;
