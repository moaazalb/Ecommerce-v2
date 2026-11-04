
"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import type { ReactNode, JSX } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { PreferencesProvider } from "@/context/PreferencesContext";
import CartPersistence from "@/components/providers/CartPersistence";

/**
 * Provides Redux, authentication, preferences and cart persistence
 * to the application.
 *
 * @param {{ children: ReactNode }} props - Application children.
 * @returns {JSX.Element} Application providers.
 */
export default function Providers({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <Provider store={store}>
      <PreferencesProvider>
        <AuthProvider>
          <CartPersistence />
          {children}
        </AuthProvider>
      </PreferencesProvider>
    </Provider>
  );
}
