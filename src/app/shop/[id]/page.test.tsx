import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductDetails from "@/app/shop/[id]/page";

// --- Mocks ---

// Mock Next.js Navigation hooks
jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "01" }), // defaults to product ID "01"
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock Redux dispatch
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => selector({ cart: { totalQuantity: 2 } }),
}));

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Next.js Image component to render a standard HTML img tag
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

describe("ProductDetails Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product details correctly for a valid product ID", () => {
    render(<ProductDetails />);

    // Check if product title is rendered in the banner and headings
    const productTitles = screen.getAllByText("Stone and Beam Westview");
    expect(productTitles.length).toBeGreaterThan(0);

    // Check if price is displayed
    expect(screen.getByText("$193")).toBeInTheDocument();

    // Check if description tab content is visible by default using getAllByText
    const descElements = screen.getAllByText(/Lorem ipsum dolor sit amet consectetur adipisicing elit/i);
    expect(descElements.length).toBeGreaterThan(0);
  });

  it("dispatches add to cart action when 'Add to Cart' button is clicked", () => {
    render(<ProductDetails />);

    const addToCartButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    // Verify that dispatch was called with the cart action
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          id: "01",
          productName: "Stone and Beam Westview ",
          price: 193,
        }),
      })
    );
  });

  it("switches between description and reviews tabs", () => {
    render(<ProductDetails />);

    const reviewsTab = screen.getByRole("heading", { name: /reviews/i });
    fireEvent.click(reviewsTab);

    // Check if review form input appears
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
  });

  it("displays an error toast if review message is empty on submit", () => {
    render(<ProductDetails />);

    // Switch to reviews tab
    fireEvent.click(screen.getByRole("heading", { name: /reviews/i }));

    // Fill in name but leave textarea empty, then submit
    fireEvent.change(screen.getByPlaceholderText("Enter name"), {
      target: { value: "Jane Doe" },
    });

    const submitButton = screen.getByRole("button", { name: /^submit$/i });
    fireEvent.click(submitButton);

    const { toast } = require("react-toastify");
    expect(toast.error).toHaveBeenCalledWith("Please enter a review message.");
  });

  it("submits the review successfully when fields are filled", () => {
    render(<ProductDetails />);

    // Switch to reviews tab
    fireEvent.click(screen.getByRole("heading", { name: /reviews/i }));

    fireEvent.change(screen.getByPlaceholderText("Enter name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Review Message..."), {
      target: { value: "Great quality furniture!" },
    });

    const submitButton = screen.getByRole("button", { name: /^submit$/i });
    fireEvent.click(submitButton);

    const { toast } = require("react-toastify");
    expect(toast.success).toHaveBeenCalledWith("Review submitted successfully!");
  });
});