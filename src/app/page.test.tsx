import { render, screen } from "@testing-library/react";
import Home from "./page";

// Mock sub-components and assets if they rely on browser APIs or complex animations
jest.mock("@/components/services/services", () => ({
  __esModule: true,
  default: () => <div data-testid="services-mock">Services Component</div>,
}));

jest.mock("@/components/UI/productList", () => ({
  __esModule: true,
  default: () => <div data-testid="product-list-mock">Product List</div>,
}));

jest.mock("@/components/UI/clock", () => ({
  __esModule: true,
  default: () => <div data-testid="clock-mock">Clock Component</div>,
}));

jest.mock("../Layout/Helmet", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}), { virtual: true });

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe("Home Page", () => {
  test("renders hero section, headings, and core sections without crashing", () => {
    render(<Home />);

    // Check headings and sections
    expect(screen.getByText(/make your interior more minimalistic/i)).toBeInTheDocument();
    expect(screen.getByText(/trending products/i)).toBeInTheDocument();
    expect(screen.getByText(/best sales/i)).toBeInTheDocument();
    expect(screen.getByText(/limited offers/i)).toBeInTheDocument();
    expect(screen.getByText(/new arrivals/i)).toBeInTheDocument();
    expect(screen.getByText(/popular in category/i)).toBeInTheDocument();

    // Check CTA links
    expect(screen.getByRole("link", { name: /shop now/i })).toHaveAttribute("href", "/shop");
    expect(screen.getByRole("link", { name: /visit store/i })).toHaveAttribute("href", "/shop");

    // Check mocked sub-components
    expect(screen.getByTestId("services-mock")).toBeInTheDocument();
    expect(screen.getByTestId("clock-mock")).toBeInTheDocument();
  });
});