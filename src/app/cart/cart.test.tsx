import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Cart from "./page";
import cartReducer from "@/redux/slices/cartSlice";
import type { CartItem } from "@/models/cart";

// Mock Helmet component
jest.mock("../Layout/Helmet", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}), { virtual: true });

// Helper function to render with a custom Redux store with explicit typing
const renderWithRedux = (
  component: React.ReactNode,
  {
    preloadedState = {
      cart: { cartItems: [] as CartItem[], totalAmount: 0, totalQuantity: 0 },
    },
    store = configureStore({
      reducer: { cart: cartReducer },
      preloadedState,
    }),
  } = {}
) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe("Cart Page", () => {
  test("renders empty state when cart has no items", () => {
    renderWithRedux(<Cart />, {
      preloadedState: {
        cart: { cartItems: [] as CartItem[], totalAmount: 0, totalQuantity: 0 },
      },
    });

    expect(screen.getByText(/no item added to the cart/i)).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /continue shopping/i })).toHaveAttribute("href", "/shop");
    expect(screen.getByRole("link", { name: /checkout/i })).toHaveAttribute("href", "/checkout");
  });

  test("renders cart items and correct subtotal when items exist", () => {
    const mockCartItems: CartItem[] = [
      {
        id: "1",
        productName: "Wireless Headphones",
        price: 150,
        quantity: 2,
        imgUrl: "/headphones.jpg",
      },
    ];

    renderWithRedux(<Cart />, {
      preloadedState: {
        cart: {
          cartItems: mockCartItems,
          totalAmount: 300,
          totalQuantity: 2,
        },
      },
    });

    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
    expect(screen.getByText("$150")).toBeInTheDocument();
    expect(screen.getByText("2px")).toBeInTheDocument();
    expect(screen.getByText("$300")).toBeInTheDocument();
  });

  test("dispatches delete action when delete button is clicked", async () => {
    const user = userEvent.setup();
    const mockCartItems: CartItem[] = [
      {
        id: "1",
        productName: "Wireless Headphones",
        price: 150,
        quantity: 1,
        imgUrl: "/headphones.jpg",
      },
    ];

    const { store } = renderWithRedux(<Cart />, {
      preloadedState: {
        cart: {
          cartItems: mockCartItems,
          totalAmount: 150,
          totalQuantity: 1,
        },
      },
    });

    const deleteButton = screen.getByRole("button", { name: /delete wireless headphones from cart/i });
    await user.click(deleteButton);

    // Verify item is removed from the store state
    expect(store.getState().cart.cartItems).toHaveLength(0);
  });
});