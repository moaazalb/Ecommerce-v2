import { render, screen } from "@testing-library/react";
import AdminNav from "./page";
import useAuth from "@/custom-hooks/useAuth/useAuth";

// Mock the custom auth hook using the correct relative/alias path matching the implementation
jest.mock("@/custom-hooks/useAuth");

/**
 * AdminNav component tests.
 * Validates rendering, navigation links, and user authentication states.
 */
describe("AdminNav", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with navigation links and search", () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });

    render(<AdminNav />);

    expect(screen.getByText("Ecommerce")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    
    // Check navigation links
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: /all-products/i })).toHaveAttribute("href", "/dashboard/all-products");
    expect(screen.getByRole("link", { name: /orders/i })).toHaveAttribute("href", "/dashboard/orders");
    expect(screen.getByRole("link", { name: /users/i })).toHaveAttribute("href", "/dashboard/users");
  });

  test("renders user profile image when currentUser exists", () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { photoURL: "https://example.com/profile.jpg" },
    });

    render(<AdminNav />);
    
    const profileImg = screen.getByAltText(/user profile/i);
    expect(profileImg).toBeInTheDocument();
    expect(profileImg).toHaveAttribute("src", "https://example.com/profile.jpg");
  });

  test("does not render user profile image when currentUser is not available", () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });

    render(<AdminNav />);
    
    expect(screen.queryByAltText(/user profile/i)).not.toBeInTheDocument();
  });
});
