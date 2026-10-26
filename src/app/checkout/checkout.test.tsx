import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Checkout from "./page";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Mock external modules
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Helmet component
jest.mock("../Layout/Helmet", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}), { virtual: true });

// Minimal mock reducer for cart state needed in Checkout
const cartMockReducer = (
  state = { totalQuantity: 2, totalAmount: 150 },
  action: any
) => state;

const renderWithRedux = (
  component: React.ReactNode,
  {
    preloadedState = { cart: { totalQuantity: 2, totalAmount: 150 } },
    store = configureStore({
      reducer: { cart: cartMockReducer },
      preloadedState,
    }),
  } = {}
) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe("Checkout Page", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test("renders checkout form fields, summary details, and disabled submit button initially", () => {
    renderWithRedux(<Checkout />);

    expect(screen.getByRole("heading", { name: /^checkout$/i })).toBeInTheDocument();
    
    // Check form fields by label
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();

    // Check cart summary totals from Redux (using getAllByText since Subtotal and Total Cost both show $150)
    expect(screen.getByText(/2 items/i)).toBeInTheDocument();
    const priceElements = screen.getAllByText("$150");
    expect(priceElements.length).toBeGreaterThan(0);

    // Submit button should be disabled initially because form is invalid
    expect(screen.getByRole("button", { name: /place an order/i })).toBeDisabled();
  });

  test("successfully fills out form, enables submit button, places order, shows success toast, and redirects", async () => {
    const user = userEvent.setup();
    renderWithRedux(<Checkout />);

    // Fill out all required fields
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/phone number/i), "1234567890");
    await user.type(screen.getByLabelText(/street address/i), "123 Main St");
    await user.type(screen.getByLabelText(/postal code/i), "12345");
    await user.type(screen.getByLabelText(/country/i), "United States");

    const submitButton = screen.getByRole("button", { name: /place an order/i });

    // Button should now be enabled since form is valid
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await user.click(submitButton);

    // Check loading state on button
    expect(screen.getByRole("button", { name: /placing order\.\.\./i })).toBeDisabled();

    // Wait for async submission timeout and success actions
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Order placed successfully!");
    }, { timeout: 2000 });

    expect(mockPush).toHaveBeenCalledWith("/home");
  });
});