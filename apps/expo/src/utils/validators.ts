import { z } from "zod";

// Onboarding schemas
export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be 8 characters."),
});

export type LoginFormSchemaType = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(1, "Password is required.")
      .min(8, "Password must be 8 characters."),
    confirmPassword: z.string().min(1, "Password confirmation is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match.",
  });

export type RegisterFormSchemaType = z.infer<typeof registerFormSchema>;
