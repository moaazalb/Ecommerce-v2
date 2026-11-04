"use client";

import { useAuthContext } from "@/context/AuthContext";

/**
 * Authentication hook.
 *
 * Provides shared authentication state and profile update utilities.
 *
 * @returns Current user, admin status, loading state and refresh function.
 */
const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
