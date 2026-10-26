import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Users from "./page";
import useGetData from "@/custom-hooks/useGetData";
import { deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";

// Mock custom hook and external modules
jest.mock("@/custom-hooks/useGetData");
jest.mock("firebase/firestore", () => ({
  ...jest.requireActual("firebase/firestore"),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Next.js image component to handle fill property in JSDOM
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ fill, priority, quality, sizes, ...props }: any) => <img {...props} />,
}));

// Mock Helmet component
jest.mock("../Layout/Helmet", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}), { virtual: true });

const mockedUseGetData = useGetData as jest.Mock;
const mockedDeleteDoc = deleteDoc as jest.Mock;

describe("Users Admin Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    mockedUseGetData.mockReturnValue({ data: [], loading: true });

    render(<Users />);

    expect(screen.getByText(/loading \.\.\.\.\./i)).toBeInTheDocument();
  });

  test("renders empty state when no users are found", () => {
    mockedUseGetData.mockReturnValue({ data: [], loading: false });

    render(<Users />);

    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  test("renders users table with correct user data", () => {
    const mockUsers = [
      {
        uid: "user-1",
        displayName: "John Doe",
        email: "john@example.com",
        photoURL: "avatar.jpg",
      },
    ];
    mockedUseGetData.mockReturnValue({ data: mockUsers, loading: false });

    render(<Users />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete user john doe/i })).toBeInTheDocument();
  });

  test("successfully deletes a user when confirmed", async () => {
    const user = userEvent.setup();
    const mockUsers = [
      {
        uid: "user-1",
        displayName: "John Doe",
        email: "john@example.com",
        photoURL: "avatar.jpg",
      },
    ];
    mockedUseGetData.mockReturnValue({ data: mockUsers, loading: false });
    mockedDeleteDoc.mockResolvedValueOnce(undefined);

    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);

    render(<Users />);

    const deleteButton = screen.getByRole("button", { name: /delete user john doe/i });
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockedDeleteDoc).toHaveBeenCalledTimes(1);
    });
    expect(toast.success).toHaveBeenCalledWith("User deleted successfully!");

    confirmSpy.mockRestore();
  });

  test("does not delete user if confirmation is cancelled", async () => {
    const user = userEvent.setup();
    const mockUsers = [
      {
        uid: "user-1",
        displayName: "John Doe",
        email: "john@example.com",
        photoURL: "avatar.jpg",
      },
    ];
    mockedUseGetData.mockReturnValue({ data: mockUsers, loading: false });

    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(false);

    render(<Users />);

    const deleteButton = screen.getByRole("button", { name: /delete user john doe/i });
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockedDeleteDoc).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  test("shows error toast when user deletion fails", async () => {
    const user = userEvent.setup();
    const mockUsers = [
      {
        uid: "user-1",
        displayName: "John Doe",
        email: "john@example.com",
        photoURL: "avatar.jpg",
      },
    ];
    mockedUseGetData.mockReturnValue({ data: mockUsers, loading: false });
    mockedDeleteDoc.mockRejectedValueOnce(new Error("Deletion failed"));

    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);

    render(<Users />);

    const deleteButton = screen.getByRole("button", { name: /delete user john doe/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Deletion failed");
    });

    confirmSpy.mockRestore();
  });
});