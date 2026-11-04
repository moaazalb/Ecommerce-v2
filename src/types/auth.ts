import { User } from "firebase/auth";
import { ReactNode } from "react";

export interface AuthState {
  currentUser: User | null;
  isAdmin: boolean;
  authLoading: boolean;
  refreshUser: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}
