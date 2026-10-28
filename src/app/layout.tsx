import "bootstrap/dist/css/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";
import "react-toastify/dist/ReactToastify.css";
import "@/globals.css";

import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import Providers from "@/components/providers/Providers";
import ClientLayout from "@/components/ClientLayout"; // wherever your ClientLayout file is

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
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