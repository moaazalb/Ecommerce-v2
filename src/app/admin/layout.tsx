
"use client";

import { useEffect, type JSX, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "reactstrap";
import useAuth from "@/custom-hooks/useAuth/useAuth";

/**
 * Admin layout props.
 */
interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Protects all admin routes.
 *
 * Only authenticated users with the Firebase admin custom claim
 * can access pages inside the admin section.
 *
 * @param {AdminLayoutProps} props Layout children.
 * @returns {JSX.Element} Protected admin layout.
 */
export default function AdminLayout({
  children,
}: AdminLayoutProps): JSX.Element {
  const router = useRouter();
  const { currentUser, isAdmin, authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (!isAdmin) {
      router.replace("/");
    }
  }, [currentUser, isAdmin, authLoading, router]);

  if (authLoading || !currentUser || !isAdmin) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "70vh", gap: "14px" }}
        role="status"
      >
        <Spinner color="primary" />
        <p className="text-muted mb-0">
          Verifying administrator permissions...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
