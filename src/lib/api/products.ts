import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "@/firebase.config";

/** Product data stored in Firestore (without the image URL). */
export interface NewProduct {
  productName: string;
  shortDesc: string;
  description: string;
  category: string;
  price: string;
}

/**
 * Uploads a product image to Firebase Storage.
 *
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} The public download URL of the uploaded image.
 * @throws {Error} If the upload or URL retrieval fails.
 */
export function uploadProductImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `productImages/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      undefined,
      reject,
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
      }
    );
  });
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
export async function addProduct(product: NewProduct, image: File): Promise<void> {
  const imgUrl = await uploadProductImage(image);
  await addDoc(collection(db, "products"), { ...product, imgUrl });
}
