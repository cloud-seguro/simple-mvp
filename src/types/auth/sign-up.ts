import { z } from "zod";

export const signUpFormSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(3).max(20),
    fullName: z.string().min(2).max(50),
    birthDate: z.date(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export type SignUpFormProps = React.HTMLAttributes<HTMLDivElement>;
