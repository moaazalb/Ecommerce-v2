"use client";

import { JSX } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import AdminNav from "@/app/admin/adminNav/page";
import { ClientLayoutProps } from "@/types/clientLayout";



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