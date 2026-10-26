import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Signup from "./page";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { uploadBytes, getDownloadURL } from "firebase/storage";
import { setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Mock external modules
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  ...jest.requireActual("firebase/auth"),
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(), // <-- Add this line
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  ...jest.requireActual("firebase/firestore"),
  doc: jest.fn(),
  setDoc: jest.fn(),
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

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ fill, priority, quality, sizes, ...props }: any) => <img {...props} />,
}));

describe("Signup Page", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test("renders signup form fields and submit button", () => {
    render(<Signup />);

    expect(screen.getByRole("heading", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create an account/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^login$/i })).toHaveAttribute("href", "/login");
  });

  test("successfully creates account, uploads avatar, updates profile, saves to firestore, and redirects", async () => {
    const user = userEvent.setup();

    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: "user-123", email: "johndoe@example.com" },
    });
    (uploadBytes as jest.Mock).mockResolvedValueOnce({});
    (getDownloadURL as jest.Mock).mockResolvedValueOnce("https://example.com/avatar.png");
    (updateProfile as jest.Mock).mockResolvedValueOnce(undefined);
    (setDoc as jest.Mock).mockResolvedValueOnce(undefined);

    render(<Signup />);

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /create an account/i });

    await user.type(usernameInput, "JohnDoe");
    await user.type(emailInput, "johndoe@example.com");
    await user.type(passwordInput, "Password123!");

    const file = new File(["dummy content"], "avatar.png", { type: "image/png" });
    await user.upload(fileInput, file);

    await user.click(submitButton);

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "johndoe@example.com",
        "Password123!"
      );
    });

    expect(uploadBytes).toHaveBeenCalled();
    expect(getDownloadURL).toHaveBeenCalled();
    expect(updateProfile).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        displayName: "JohnDoe",
        photoURL: "https://example.com/avatar.png",
      })
    );
    expect(setDoc).toHaveBeenCalled();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Account created");
    });

    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  test("shows error toast when signup fails", async () => {
    const user = userEvent.setup();
    const errorMessage = "Email already in use";
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(<Signup />);

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /create an account/i });

    await user.type(usernameInput, "JohnDoe");
    await user.type(emailInput, "johndoe@example.com");
    await user.type(passwordInput, "Password123!");

    const file = new File(["dummy content"], "avatar.png", { type: "image/png" });
    await user.upload(fileInput, file);

    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });

    expect(toast.success).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});