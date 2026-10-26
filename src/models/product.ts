import type { StaticImageData } from "next/image";

export type ProductCategory = "sofa" | "chair" | "mobile" | "watch" | "wireless";

export interface Review {
  rating: number;
  text: string;
}

export interface Product {
  id: string;
  productName: string;
  imgUrl: StaticImageData;
  category: ProductCategory;
  price: number;
  shortDesc: string;
  description: string;
  reviews: Review[];
  avgRating: number;
}