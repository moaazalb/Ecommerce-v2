
import "bootstrap/dist/css/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Montserrat, Playfair_Display } from "next/font/google";

import { ToastContainer } from "react-toastify";
import Providers from "@/components/providers/providers";
import ClientLayout from "@/components/clientLayout";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: {
    default: "Your Store",
    template: "%s | Your Store",
  },
  description: "Discover timeless fashion and contemporary collections.",
   icons: {
      icon: "/assets/images/eco-logo.png",
      shortcut: "/assets/images/eco-logo.png",
      apple: "/assets/images/eco-logo.png",
    },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${playfair.variable}`}>
        <Providers>
          <ToastContainer
            theme="dark"
            position="top-right"
            autoClose={3000}
            closeOnClick
            pauseOnHover={false}
          />

          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
