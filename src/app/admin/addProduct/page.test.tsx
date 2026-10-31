import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { addProduct } from "@/lib/api/products";
import AddProductPage from "./page";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock("react-toastify", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
jest.mock("@/lib/api/products", () => ({ addProduct: jest.fn() }));

const mockedAddProduct = addProduct as jest.Mock;
type User = ReturnType<typeof userEvent.setup>;

/** Fills every field with valid data. */
async function fillValidForm(user: User): Promise<void> {
  await user.type(screen.getByLabelText(/product title/i), "Double sofa");
  await user.type(screen.getByLabelText(/short description/i), "A comfortable double sofa");
  await user.type(screen.getByLabelText(/^description$/i), "A comfortable double sofa made of soft fabric.");
  await user.type(screen.getByLabelText(/price/i), "100");
  await user.selectOptions(screen.getByLabelText(/category/i), "sofa");
  await user.upload(screen.getByLabelText(/product image/i), new File(["img"], "sofa.png", { type: "image/png" }));
}

describe("AddProductPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all fields and the submit button", () => {
    render(<AddProductPage />);
    expect(screen.getByRole("heading", { name: /add product/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/product title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/product image/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add product/i })).toBeEnabled();
  });

  it("shows errors and does not submit when the form is empty", async () => {
    const user = userEvent.setup();
    render(<AddProductPage />);
    await user.click(screen.getByRole("button", { name: /add product/i }));

    expect(await screen.findByText(/title must be at least 3 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/please select a category/i)).toBeInTheDocument();
    expect(screen.getByText(/product image is required/i)).toBeInTheDocument();
    expect(mockedAddProduct).not.toHaveBeenCalled();
  });

  it("rejects an invalid price", async () => {
    const user = userEvent.setup();
    render(<AddProductPage />);
    await user.type(screen.getByLabelText(/price/i), "abc");
    await user.click(screen.getByRole("button", { name: /add product/i }));
    expect(await screen.findByText(/enter a valid price/i)).toBeInTheDocument();
  });

  it("rejects a non-image file", async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<AddProductPage />);
    await user.upload(screen.getByLabelText(/product image/i), new File(["x"], "doc.txt", { type: "text/plain" }));
    await user.click(screen.getByRole("button", { name: /add product/i }));
    expect(await screen.findByText(/only jpg, png or webp/i)).toBeInTheDocument();
  });

  it("submits valid data, shows success and redirects", async () => {
    mockedAddProduct.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    render(<AddProductPage />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /add product/i }));

    await waitFor(() => expect(mockedAddProduct).toHaveBeenCalledTimes(1));
    expect(mockedAddProduct).toHaveBeenCalledWith(
      expect.objectContaining({ productName: "Double sofa", category: "sofa", price: "100" }),
      expect.any(File)
    );
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Product successfully added!"));
    expect(mockPush).toHaveBeenCalledWith("/dashboard/all-products");
  });

  it("shows an error toast and does not redirect when saving fails", async () => {
    mockedAddProduct.mockRejectedValueOnce(new Error("fail"));
    const user = userEvent.setup();
    render(<AddProductPage />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /add product/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Product not added!"));
    expect(toast.success).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
