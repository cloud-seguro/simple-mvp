import * as z from "zod";

export const profileFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must not be longer than 20 characters" }),
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must not be longer than 50 characters" }),
  bio: z
    .string()
    .max(500, { message: "Bio must not be longer than 500 characters" })
    .optional()
    .nullable(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>; 