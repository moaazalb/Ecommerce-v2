import { JSX } from "react";
import ProductCard from "./productCard";
import type {ProductsListProps } from "@/types/product";



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