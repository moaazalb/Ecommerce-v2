import { renderHook, waitFor } from "@testing-library/react";
import useGetData from "./useGetData";
import { collection, onSnapshot } from "firebase/firestore";

// Mock Firebase Firestore methods
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  onSnapshot: jest.fn(),
}));

// Mock firebase config
jest.mock("../firebase.config", () => ({
  db: {},
}));

describe("useGetData Custom Hook", () => {
  const mockCollectionRef = {};
  const mockUnsubscribe = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (collection as jest.Mock).mockReturnValue(mockCollectionRef);
  });

  test("should initialize with loading true and empty data", () => {
    (onSnapshot as jest.Mock).mockReturnValue(mockUnsubscribe);

    const { result } = renderHook(() => useGetData("products"));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(collection).toHaveBeenCalledWith(expect.anything(), "products");
  });

  test("should fetch data, map document IDs, and set loading to false when snapshot emits", async () => {
    const mockDocs = [
      { id: "1", data: () => ({ productName: "Modern Sofa", price: 300 }) },
      { id: "2", data: () => ({ productName: "Office Chair", price: 120 }) },
    ];

    const mockSnapshot = {
      docs: mockDocs,
    };

    // Simulate onSnapshot triggering its callback with mock data
    (onSnapshot as jest.Mock).mockImplementation((ref, callback) => {
      callback(mockSnapshot);
      return mockUnsubscribe;
    });

    const { result } = renderHook(() => useGetData("products"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual([
      { id: "1", productName: "Modern Sofa", price: 300 },
      { id: "2", productName: "Office Chair", price: 120 },
    ]);
  });
});