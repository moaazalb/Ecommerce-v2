import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CartState } from "@/types/cart";

const initialState: CartState = {
  cartItems: [],
  totalAmount: 0,
  totalQuantity: 0,
};

/**
 * Redux Toolkit slice for managing shopping cart state.
 */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /**
     * Adds an item to the cart or increments its quantity if it already exists.
     *
     * @param {CartState} state - The current cart state.
     * @param {PayloadAction<Omit<CartItem, 'quantity'>>} action - The action containing the new item.
     */
    addItem(state, action: PayloadAction<Omit<CartItem, "quantity">>) {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id,
      );

      state.totalQuantity++;

      if (!existingItem) {
        state.cartItems.push({
          ...newItem,
          quantity: 1,
        });
      } else {
        existingItem.quantity++;
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0,
      );
    },

    /**
     * Deletes an item from the cart by its ID.
     *
     * @param {CartState} state - The current cart state.
     * @param {PayloadAction<string>} action - The action containing the item ID to delete.
     */
    deleteItem(state, action: PayloadAction<string>) {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
        state.totalQuantity -= existingItem.quantity;
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0,
      );
    },

    /**
     * Restores the user's previously saved cart.
     *
     * Recalculates the total amount and quantity from the restored items.
     *
     * @param {CartState} state - The current cart state.
     * @param {PayloadAction<CartItem[]>} action - The saved cart items.
     */
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.cartItems = action.payload;
      state.totalQuantity = action.payload.reduce(
        (total, item) => total + Number(item.quantity),
        0,
      );
      state.totalAmount = action.payload.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0,
      );
    },

    /**
     * Clears all items and resets the shopping cart totals.
     *
     * @param {CartState} state - The current cart state.
     */
    clearCart(state) {
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
