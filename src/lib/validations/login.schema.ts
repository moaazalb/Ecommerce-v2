import { z } from "zod";
import type { TFunction } from "i18next";

/**
 * Creates a localized validation schema for the login form.
 */
export const createLoginSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .trim()
      .email(t("login.validation.emailInvalid")),
    password: z
      .string()
      .min(1, t("login.validation.passwordRequired")),
  });

/** Form values inferred from the login schema. */
export type LoginFormValues = z.infer<
  ReturnType<typeof createLoginSchema>
>;
