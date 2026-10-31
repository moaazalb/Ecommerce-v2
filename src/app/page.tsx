
"use client";

import { useEffect, type JSX } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/custom-hooks/useAuth/useAuth";
import Home from "@/components/home/home";

/**
 * Protects the homepage and redirects unauthenticated users to login.
 *
 * @returns {JSX.Element} The homepage or authentication loading state.
 */
export default function HomePage(): JSX.Element {
  const router = useRouter();
  const { currentUser, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.replace("/login");
    }
  }, [currentUser, authLoading, router]);

  if (authLoading || !currentUser) {
    return (
      <div className="auth-loading">
        <div className="auth-loading__spinner" />
        <p>Checking your account...</p>
      </div>
    );
  }

  return <Home />;
}
