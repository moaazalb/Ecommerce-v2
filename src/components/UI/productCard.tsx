"use client";

import React, { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { cartActions } from "@/store/slices/cartSlice";
import type { Product } from "@/models/product";
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
        price: item.price,
        imgUrl: item.imgUrl.src,
      })
    );
    toast.success("Product added successfully!");
  };

  return (
    <div className="col-lg-3 col-md-4 mb-4">
      <div className="product__item">
        <div className="product__img">
          <motion.div whileHover={{ scale: 0.9 }}>
            <Link href={`/shop/${item.id}`}>
              <Image
                src={item.imgUrl}
                alt={item.productName || "Product image"}
                style={{ height: "auto" }}
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
          <motion.span
            whileTap={{ scale: 1.2 }}
            onClick={handleAddToCart}
            role="button"
            aria-label={`Add ${item.productName} to cart`}
          >
            <i className="ri-add-line"></i>
          </motion.span>
        </div>
      </div>
    </div>
  );
}