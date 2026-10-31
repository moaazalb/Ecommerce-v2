
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { store, type AppDispatch } from "@/store/store";
import { cartActions } from "@/store/slices/cartSlice";

/**
 * Restores the shopping cart from localStorage and persists updates.
 *
 * @returns {null} No visible UI.
 */
export default function CartPersistence(): null {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("shopping-cart");

      if (savedCart) {
        const parsedCart: unknown = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          dispatch(cartActions.setCart(parsedCart));
        }
      }
    } catch (error) {
      console.error("Failed to restore shopping cart:", error);
    }

    const unsubscribe = store.subscribe(() => {
      try {
        const { cartItems } = store.getState().cart;

        localStorage.setItem(
          "shopping-cart",
          JSON.stringify(cartItems)
        );
      } catch (error) {
        console.error("Failed to save shopping cart:", error);
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return null;
}
