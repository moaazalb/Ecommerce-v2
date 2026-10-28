"use client";

import React, { JSX } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import AdminNav from "@/app/admin/AdminNav/page";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps): JSX.Element {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? <AdminNav /> : <Header />}
      <main className="min-vh-100">{children}</main>
      <Footer />
    </>
  );
}