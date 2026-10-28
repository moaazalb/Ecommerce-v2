import React, { JSX } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/models/product";

interface ProductsListProps {
  data: Product[];
}

/**
 * ProductsList component for rendering a list of product cards.
 * Each ProductCard carries its own Bootstrap column, and the parent
 * provides the surrounding `.row`.
 *
 * @param {ProductsListProps} props - Component props containing product array.
 * @returns {JSX.Element} The rendered list of products.
 */
export default function ProductsList({ data }: ProductsListProps): JSX.Element {
  return (
    <>
      {data?.map((item) => (
        <ProductCard item={item} key={item.id} />
      ))}
    </>
  );
}