import type { HTMLAttributes } from "react";
import type { z } from "zod";
import { string, object } from "zod";

export type SignUpFormProps = HTMLAttributes<HTMLDivElement>;

export const signUpFormSchema = object({
  email: string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  password: string()
    .min(1, { message: "Please enter your password" })
    .min(7, { message: "Password must be at least 7 characters long" }),
  confirmPassword: string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>; 