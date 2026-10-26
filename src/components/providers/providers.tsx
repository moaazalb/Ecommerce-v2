"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import type { ReactNode, JSX } from "react";

export default function Providers({ children }: { children: ReactNode }): JSX.Element {
  return <Provider store={store}>{children}</Provider>;
}