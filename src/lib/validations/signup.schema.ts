import { z } from "zod";

/** Maximum allowed avatar image size (5 MB). */
export const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

/** Allowed avatar MIME types. */
export const ACCEPTED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Validation schema for the user signup form.
 */
export const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username is too long (max 50)"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
  file: z
    .custom<FileList>(
      (value) => typeof FileList !== "undefined" && value instanceof FileList && value.length > 0,
      "Profile image is required"
    )
    .refine((files) => !files?.[0] || files[0].size <= MAX_AVATAR_SIZE, "Image must be 5 MB or smaller")
    .refine((files) => !files?.[0] || ACCEPTED_AVATAR_TYPES.includes(files[0].type), "Only JPG, PNG or WEBP images are allowed"),
});

/** Form values inferred from {@link signupSchema}. */
export type SignupFormValues = z.infer<typeof signupSchema>;
