import { renderHook, act } from "@testing-library/react";
import useAuth from "./useAuth";
import { onAuthStateChanged } from "firebase/auth";

// Mock firebase/auth
jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
}));

// Mock firebase config
jest.mock("../firebase.config", () => ({
  auth: {},
}));

const mockedOnAuthStateChanged = onAuthStateChanged as jest.Mock;

describe("useAuth Custom Hook", () => {
  const mockUnsubscribe = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedOnAuthStateChanged.mockReturnValue(mockUnsubscribe);
  });

  test("should initialize with currentUser as null", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.currentUser).toBeNull();
    expect(mockedOnAuthStateChanged).toHaveBeenCalledTimes(1);
  });

  test("should update currentUser when authentication state changes", () => {
    let authCallback: (user: any) => void = () => {};
    
    // Capture the callback passed to onAuthStateChanged
    mockedOnAuthStateChanged.mockImplementation((auth, callback) => {
      authCallback = callback;
      return mockUnsubscribe;
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.currentUser).toBeNull();

    // Simulate user logging in
    const mockUser = { uid: "123", email: "john@example.com" };
    act(() => {
      authCallback(mockUser);
    });

    expect(result.current.currentUser).toEqual(mockUser);

    // Simulate user logging out
    act(() => {
      authCallback(null);
    });

    expect(result.current.currentUser).toBeNull();
  });

  test("should unsubscribe from auth state changes on unmount", () => {
    const { unmount } = renderHook(() => useAuth());

    expect(mockUnsubscribe).not.toHaveBeenCalled();

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});