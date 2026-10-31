
import type { StaticImageData } from "next/image";

export type ProductCategory = "sofa" | "chair" | "mobile" | "watch" | "wireless";

export interface Review {
  rating: number;
  text: string;
}

/**
 * Supports both locally imported images and remote image URLs.
 */
export type ProductImage = StaticImageData | string;

export interface Product {
  id: string;
  productName: string;
  imgUrl: ProductImage;
  category: ProductCategory;
  price: number;
  shortDesc: string;
  description: string;
  reviews: Review[];
  avgRating: number;
}
