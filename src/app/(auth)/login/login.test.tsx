import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./page";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Mock external modules
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  ...jest.requireActual("firebase/auth"),
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Helmet component using virtual: true so Jest doesn't fail if the relative file path differs
jest.mock("../Layout/Helmet", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}), { virtual: true });

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ fill, priority, quality, sizes, ...props }: any) => {
    // Omit Next.js specific props so they don't get passed to the HTML img tag
    return <img {...props} />;
  },
}));

describe("Login Page", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test("renders login form fields and submit button", () => {
    render(<Login />);

    expect(screen.getByRole("heading", { name: /^login$/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^login$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /create an account/i })).toHaveAttribute("href", "/signup");
  });

  test("shows validation errors when submitting empty fields", async () => {
    const user = userEvent.setup();
    render(<Login />);

    const submitButton = screen.getByRole("button", { name: /^login$/i });
    await user.click(submitButton);

    // Zod validation messages should appear
    expect(await screen.findByPlaceholderText(/enter your email/i)).toBeInvalid();
  });

  test("successfully logs in with valid credentials, shows success toast, and redirects", async () => {
    const user = userEvent.setup();
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { email: "test@example.com" },
    });

    render(<Login />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /^login$/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Password123!");
    await user.click(submitButton);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
    });

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "test@example.com",
      "Password123!"
    );

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Successfully logged in");
    });

    expect(mockPush).toHaveBeenCalledWith("/checkout");
  });

  test("shows error toast when login fails", async () => {
    const user = userEvent.setup();
    const errorMessage = "Invalid login credentials";
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(<Login />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /^login$/i });

    await user.type(emailInput, "wrong@example.com");
    await user.type(passwordInput, "WrongPassword!");
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });

    expect(toast.success).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  test("disables submit button and shows loading state while submitting", async () => {
    const user = userEvent.setup();
    // Simulate a pending promise to inspect the loading state
    let resolveLogin: (value: any) => void = () => {};
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });

    (signInWithEmailAndPassword as jest.Mock).mockReturnValueOnce(loginPromise);

    render(<Login />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /^login$/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Password123!");
    await user.click(submitButton);

    // Check loading text and disabled button
    expect(screen.getByRole("button", { name: /logging in\.\.\./i })).toBeDisabled();

    // Resolve the promise to finish submission
    resolveLogin({ user: { email: "test@example.com" } });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Successfully logged in");
    });
  });
});