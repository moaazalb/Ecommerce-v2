
"use client";

import { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { cartActions } from "@/store/slices/cartSlice";
import type { Product } from "@/types/product";
import "@/styles/product-card.css";

interface ProductCardProps {
  item: Product;
}

/**
 * ProductCard component representing an individual product card in the listing.
 *
 * @param {ProductCardProps} props - Component props containing the product item.
 * @returns {JSX.Element} The rendered product card.
 */
export default function ProductCard({ item }: ProductCardProps): JSX.Element {
  const dispatch = useDispatch();

  /**
   * Adds the product to the shopping cart and shows a success toast.
   */
  const handleAddToCart = (): void => {
    dispatch(
    cartActions.addItem({
      id: item.id,
      productName: item.productName,
      price: Number(item.price),
      imgUrl: productImage,
    })
  );

    toast.success("Product added successfully!");
  };

    /**
   * Resolves the product image URL for Next.js Image.
   *
   * @returns {string} The resolved image URL.
   */
  const productImage =
  typeof item.imgUrl === "string" ? item.imgUrl : item.imgUrl.src;

  return (
    <div className="col-lg-3 col-md-4 mb-4">
      <div className="product__item">
        <div className="product__img">
          <motion.div whileHover={{ scale: 0.9 }}>
            <Link href={`/shop/${item.id}`}>
              <Image
                src={productImage}
                alt={item.productName || "Product image"}
                width={500}
                height={500}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </Link>
          </motion.div>
        </div>

        <div className="p-2 product__info">
          <h3>
            <Link href={`/shop/${item.id}`}>{item.productName}</Link>
          </h3>
          <span>{item.category}</span>
        </div>

        <div className="product__card-bottom d-flex align-items-center justify-content-between p-2">
          <span className="price">${item.price}</span>

          <motion.button
            type="button"
            className="product__add-button"
            whileTap={{ scale: 1.2 }}
            onClick={handleAddToCart}
            aria-label={`Add ${item.productName} to cart`}
          >
            <i className="ri-add-line" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
