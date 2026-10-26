import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Shop from "./page";

// Mock sub-components and assets
jest.mock("@/components/UI/productList", () => ({
  __esModule: true,
  default: ({ data }: { data: any[] }) => (
    <div data-testid="product-list">
      {data.map((item) => (
        <div key={item.id} data-testid="product-item">
          {item.productName}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/components/UI/commonSection", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="common-section">{title}</div>,
}));

jest.mock("../Layout/Helmet", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}), { virtual: true });

jest.mock("@/assets/data/products", () => [
  { id: "1", productName: "Comfortable Sofa", category: "sofa" },
  { id: "2", productName: "Smartphone X", category: "mobile" },
  { id: "3", productName: "Office Chair", category: "chair" },
]);

describe("Shop Page", () => {
  test("renders shop components, filter/sort options, and initial products", () => {
    render(<Shop />);

    expect(screen.getByTestId("common-section")).toHaveTextContent("products");
    
    // Use getAllByRole since there are multiple select elements (filter and sort)
    const comboboxes = screen.getAllByRole("combobox");
    expect(comboboxes.length).toBe(2);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();

    // Initial products should be displayed
    const products = screen.getAllByTestId("product-item");
    expect(products.length).toBe(3);
  });

  test("filters products by category", async () => {
    const user = userEvent.setup();
    render(<Shop />);

    const filterSelect = screen.getAllByRole("combobox")[0];
    await user.selectOptions(filterSelect, "sofa");

    // Should only show the sofa product
    const products = screen.getAllByTestId("product-item");
    expect(products.length).toBe(1);
    expect(screen.getByText("Comfortable Sofa")).toBeInTheDocument();
  });

  test("filters products by search term and shows empty state if no match", async () => {
    const user = userEvent.setup();
    render(<Shop />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, "Smartphone");

    expect(screen.getByText("Smartphone X")).toBeInTheDocument();
    expect(screen.queryByText("Comfortable Sofa")).not.toBeInTheDocument();

    // Test no products found state
    await user.clear(searchInput);
    await user.type(searchInput, "NonexistentProduct");

    expect(screen.getByText(/no products are found!/i)).toBeInTheDocument();
  });
});