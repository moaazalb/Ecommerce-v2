"use client";

import { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { cartActions } from "@/store/slices/cartSlice";
import type { ProductCardProps } from "@/types/product";
import "@/styles/product-card.css";

export default function ProductCard({ item }: ProductCardProps): JSX.Element {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Get the translated product name.
  // If no translation exists, use the original product name.
  const productName = t(`products.items.${item.id}.name`, {
    defaultValue: item.productName,
  });
  // Translate category.
  const category = t(`shop.categories.${item.category}`, {
    defaultValue: item.category,
  });
  // Resolve product image URL.
  const productImage =
    typeof item.imgUrl === "string" ? item.imgUrl : item.imgUrl.src;

  const handleAddToCart = (): void => {
    dispatch(
      cartActions.addItem({
        id: item.id,
        // Keep original data in Redux/cart.
        productName: item.productName,
        price: Number(item.price),
        imgUrl: productImage,
      }),
    );

    toast.success(t("productCard.addedSuccessfully"));
  };

  return (
    <div className="col-lg-3 col-md-4 mb-4">
      <div className="product__item">
        <div className="product__img">
          <motion.div whileHover={{ scale: 0.9 }}>
            <Link href={`/shop/${item.id}`}>
              <Image
                src={productImage}
                alt={productName || "Product image"}
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
            <Link href={`/shop/${item.id}`}>{productName}</Link>
          </h3>
          <span>{category}</span>
        </div>

        <div className="product__card-bottom d-flex align-items-center justify-content-between p-2">
          <span className="price">${item.price}</span>
          <motion.button
            type="button"
            className="product__add-button"
            whileTap={{ scale: 1.2 }}
            onClick={handleAddToCart}
            aria-label={t("productCard.addToCart", {
              name: productName,
            })}
          >
            <i className="ri-add-line" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
