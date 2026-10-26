import { z } from "zod";

/** Categories a product can belong to. */
export const PRODUCT_CATEGORIES = ["chair", "sofa", "mobile", "watch", "wireless"] as const;

/** Maximum allowed image size (5 MB). */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/** Allowed image MIME types. */
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Validation schema for the "Add Product" form.
 * Price is kept as a string (as in the original app) and validated by pattern.
 */
export const productSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100, "Title is too long (max 100)"),
  shortDesc: z.string().trim().min(10, "Short description must be at least 10 characters").max(200, "Short description is too long (max 200)"),
  description: z.string().trim().min(20, "Description must be at least 20 characters").max(2000, "Description is too long (max 2000)"),
  price: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price, e.g. 100 or 99.99")
    .refine((value) => Number(value) > 0, "Price must be greater than 0"),
  category: z
    .string()
    .refine((value) => (PRODUCT_CATEGORIES as readonly string[]).includes(value), "Please select a category"),
  image: z
    .custom<FileList>((value) => typeof FileList !== "undefined" && value instanceof FileList && value.length > 0, "Product image is required")
    .refine((files) => !files?.[0] || files[0].size <= MAX_IMAGE_SIZE, "Image must be 5 MB or smaller")
    .refine((files) => !files?.[0] || ACCEPTED_IMAGE_TYPES.includes(files[0].type), "Only JPG, PNG or WEBP images are allowed"),
});

/** Form values inferred from {@link productSchema}. */
export type ProductFormValues = z.infer<typeof productSchema>;
