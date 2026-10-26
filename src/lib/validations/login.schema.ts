// src/lib/validations/login.schema.ts
import { z } from "zod";

/**
 * Validation schema for the login form.
 */
export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

/** Form values inferred from {@link loginSchema}. */
export type LoginFormValues = z.infer<typeof loginSchema>;