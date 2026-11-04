
import { z } from "zod";
import type { TFunction } from "i18next";

/** Maximum allowed avatar image size (5 MB). */
export const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

/** Allowed avatar MIME types. */
export const ACCEPTED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/**
 * Creates a localized validation schema for the user signup form.
 */
export const createSignupSchema = (t: TFunction) =>
  z.object({
    username: z
      .string()
      .trim()
      .min(3, t("signup.validation.usernameMin"))
      .max(50, t("signup.validation.usernameMax")),

    email: z
      .string()
      .trim()
      .email(t("signup.validation.emailInvalid")),

    password: z
      .string()
      .min(6, t("signup.validation.passwordMin"))
      .max(100, t("signup.validation.passwordMax")),

    file: z
      .custom<FileList>(
        (value) =>
          typeof FileList !== "undefined" &&
          value instanceof FileList &&
          value.length > 0,
        t("signup.validation.imageRequired")
      )
      .refine(
        (files) => !files?.[0] || files[0].size <= MAX_AVATAR_SIZE,
        t("signup.validation.imageSize")
      )
      .refine(
        (files) =>
          !files?.[0] ||
          ACCEPTED_AVATAR_TYPES.includes(files[0].type),
        t("signup.validation.imageType")
      ),
  });

/** Form values inferred from the signup schema. */
export type SignupFormValues = z.infer<
  ReturnType<typeof createSignupSchema>
>;
