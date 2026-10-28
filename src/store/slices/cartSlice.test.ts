import cartReducer, { cartActions } from "./cartSlice";
import type { CartItem } from "@/models/cart";

describe("cartSlice reducer", () => {
  const initialState = {
    cartItems: [],
    totalAmount: 0,
    totalQuantity: 0,
  };

  test("should return the initial state by default", () => {
    expect(cartReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  test("should handle addItem when the cart is empty (new item)", () => {
    const newItem = {
      id: "1",
      productName: "Wireless Headphones",
      price: 150,
      imgUrl: "/headphones.jpg",
    };

    const actual = cartReducer(initialState, cartActions.addItem(newItem));

    expect(actual.cartItems).toHaveLength(1);
    expect(actual.cartItems[0]).toEqual({
      ...newItem,
      quantity: 1,
    });
    expect(actual.totalQuantity).toBe(1);
    expect(actual.totalAmount).toBe(150);
  });

  test("should handle addItem when the item already exists (increment quantity)", () => {
    const existingState = {
      cartItems: [
        {
          id: "1",
          productName: "Wireless Headphones",
          price: 150,
          imgUrl: "/headphones.jpg",
          quantity: 1,
        },
      ],
      totalAmount: 150,
      totalQuantity: 1,
    };

    const newItem = {
      id: "1",
      productName: "Wireless Headphones",
      price: 150,
      imgUrl: "/headphones.jpg",
    };

    const actual = cartReducer(existingState, cartActions.addItem(newItem));

    expect(actual.cartItems).toHaveLength(1);
    expect(actual.cartItems[0].quantity).toBe(2);
    expect(actual.totalQuantity).toBe(2);
    expect(actual.totalAmount).toBe(300);
  });

  test("should handle deleteItem when item exists", () => {
    const existingState = {
      cartItems: [
        {
          id: "1",
          productName: "Wireless Headphones",
          price: 150,
          imgUrl: "/headphones.jpg",
          quantity: 2,
        },
      ],
      totalAmount: 300,
      totalQuantity: 2,
    };

    const actual = cartReducer(existingState, cartActions.deleteItem("1"));

    expect(actual.cartItems).toHaveLength(0);
    expect(actual.totalQuantity).toBe(0);
    expect(actual.totalAmount).toBe(0);
  });

  test("should do nothing when deleting an item ID that does not exist", () => {
    const existingState = {
      cartItems: [
        {
          id: "1",
          productName: "Wireless Headphones",
          price: 150,
          imgUrl: "/headphones.jpg",
          quantity: 1,
        },
      ],
      totalAmount: 150,
      totalQuantity: 1,
    };

    const actual = cartReducer(existingState, cartActions.deleteItem("999"));

    expect(actual).toEqual(existingState);
  });
});