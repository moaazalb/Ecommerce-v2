import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase.config";
import { CloudinaryUploadResponse } from "@/types/cloudinary";
import { NewProduct } from "@/types/product";

/**
 * Uploads a product image to Cloudinary.
 *
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} The secure public URL of the uploaded image.
 * @throws {Error} If the upload or URL retrieval fails.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRODUCT_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration is missing.");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const result = (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message || "Failed to upload product image.");
  }

  return result.secure_url;
}

/**
 * Uploads the image, then saves the product in the "products" collection.
 * Resolves only after BOTH steps finish.
 *
 * @param {NewProduct} product - The product fields.
 * @param {File} image - The product image.
 * @returns {Promise<void>}
 * @throws {Error} If the upload or the Firestore write fails.
 */
export async function addProduct(
  product: NewProduct,
  image: File,
): Promise<void> {
  const imgUrl = await uploadProductImage(image);

  await addDoc(collection(db, "products"), {
    ...product,
    imgUrl,
  });
}
