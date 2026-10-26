import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AllProducts from "../../../components/allProducts/allProducts";
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

// Mock Next.js image component to avoid layout errors in JSDOM
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock Helmet component
jest.mock("../Layout/Helmet", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockedUseGetData = useGetData as jest.Mock;
const mockedDeleteDoc = deleteDoc as jest.Mock;

describe("AllProducts Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    mockedUseGetData.mockReturnValue({ data: [], loading: true });

    render(<AllProducts />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("renders empty state when no products are found", () => {
    mockedUseGetData.mockReturnValue({ data: [], loading: false });

    render(<AllProducts />);

    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  test("renders products table with correct data", () => {
    const mockProducts = [
      {
        id: "1",
        productName: "Modern Sofa",
        category: "sofa",
        price: 299,
        imgUrl: "sofa.jpg",
      },
    ];
    mockedUseGetData.mockReturnValue({ data: mockProducts, loading: false });

    render(<AllProducts />);

    expect(screen.getByText("Modern Sofa")).toBeInTheDocument();
    expect(screen.getByText("sofa")).toBeInTheDocument();
    expect(screen.getByText("$299")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete modern sofa/i })).toBeInTheDocument();
  });

  test("successfully deletes a product when confirmed", async () => {
    const user = userEvent.setup();
    const mockProducts = [
      {
        id: "1",
        productName: "Modern Sofa",
        category: "sofa",
        price: 299,
        imgUrl: "sofa.jpg",
      },
    ];
    mockedUseGetData.mockReturnValue({ data: mockProducts, loading: false });
    mockedDeleteDoc.mockResolvedValueOnce(undefined);

    // Mock window.confirm to return true
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);

    render(<AllProducts />);

    const deleteButton = screen.getByRole("button", { name: /delete modern sofa/i });
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockedDeleteDoc).toHaveBeenCalledTimes(1);
    });
    expect(toast.success).toHaveBeenCalledWith("Deleted successfully!");

    confirmSpy.mockRestore();
  });

  test("does not delete product if confirmation is cancelled", async () => {
    const user = userEvent.setup();
    const mockProducts = [
      {
        id: "1",
        productName: "Modern Sofa",
        category: "sofa",
        price: 299,
        imgUrl: "sofa.jpg",
      },
    ];
    mockedUseGetData.mockReturnValue({ data: mockProducts, loading: false });

    // Mock window.confirm to return false
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(false);

    render(<AllProducts />);

    const deleteButton = screen.getByRole("button", { name: /delete modern sofa/i });
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockedDeleteDoc).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  test("shows error toast when deletion fails", async () => {
    const user = userEvent.setup();
    const mockProducts = [
      {
        id: "1",
        productName: "Modern Sofa",
        category: "sofa",
        price: 299,
        imgUrl: "sofa.jpg",
      },
    ];
    mockedUseGetData.mockReturnValue({ data: mockProducts, loading: false });
    mockedDeleteDoc.mockRejectedValueOnce(new Error("Network error"));

    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);

    render(<AllProducts />);

    const deleteButton = screen.getByRole("button", { name: /delete modern sofa/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network error");
    });

    confirmSpy.mockRestore();
  });
});