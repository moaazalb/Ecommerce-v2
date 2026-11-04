export interface CloudinaryResponse {
  secure_url: string;
}

/** Cloudinary upload response. */
export interface CloudinaryUploadResponse {
  secure_url?: string;
  error?: {
    message?: string;
  };
}
