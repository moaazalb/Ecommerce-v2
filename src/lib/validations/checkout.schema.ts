import { z } from "zod";

/**
 * Zod validation schema for the checkout form.
 */
export const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  streetAddress: z.string().min(5, "Street address is required."),
  postalCode: z.string().min(3, "Postal code is required."),
  country: z.string().min(2, "Country is required."),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
