"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onIdTokenChanged, getIdTokenResult, type User } from "firebase/auth";
import { auth } from "@/firebase.config";
import { AuthProviderProps, AuthState } from "@/types/auth";

const AuthContext = createContext<AuthState | undefined>(undefined);

/**
 * Provides shared authentication state to the application.
 *
 * Tracks the authenticated Firebase user, verifies admin permissions,
 * and allows profile information to be refreshed across components.
 *
 * @param {AuthProviderProps} props - Provider children.
 * @returns {JSX.Element} The authentication context provider.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileVersion, setProfileVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setAuthLoading(true);
      setCurrentUser(user);
      setIsAdmin(false);

      if (!user) {
        setAuthLoading(false);
        return;
      }

      try {
        const tokenResult = await getIdTokenResult(user);
        setIsAdmin(tokenResult.claims.admin === true);
      } catch (error) {
        console.error("Failed to verify user permissions:", error);
        setIsAdmin(false);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Reloads the current Firebase user and notifies all consumers.
   *
   * @returns {Promise<void>}
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    const user = auth.currentUser;

    if (!user) {
      setCurrentUser(null);
      return;
    }

    await user.reload();

    const updatedUser = auth.currentUser;

    setCurrentUser(updatedUser);
    setProfileVersion((version) => version + 1);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAdmin,
      authLoading,
      refreshUser,
    }),
    [currentUser, isAdmin, authLoading, refreshUser, profileVersion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Accesses the shared authentication context.
 *
 * @returns {AuthState} Current authentication state and profile actions.
 */
export function useAuthContext(): AuthState {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider.");
  }

  return context;
}
