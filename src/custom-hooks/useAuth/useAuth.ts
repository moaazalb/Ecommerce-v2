
"use client";

import { useState, useEffect } from "react";
import {
  onIdTokenChanged,
  getIdTokenResult,
  type User,
} from "firebase/auth";
import { auth } from "@/firebase.config";

interface AuthState {
  currentUser: User | null;
  isAdmin: boolean;
  authLoading: boolean;
}

/**
 * Authentication hook.
 *
 * Tracks the currently authenticated Firebase user and checks
 * whether the user has the admin custom claim.
 *
 * @returns {AuthState} Current user, admin status, and loading state.
 */
const useAuth = (): AuthState => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

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

  return {
    currentUser,
    isAdmin,
    authLoading,
  };
};

export default useAuth;
