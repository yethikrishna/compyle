import { AuthInfo } from "@/types";
import { create } from "zustand";

type AuthStore = {
  authInfo: AuthInfo | null;
  isInitialPending: boolean;
};

type AuthStoreActions = {
  setAuthState: (newState: Partial<AuthStore>) => void;
};

export const useAuthStore = create<AuthStore & AuthStoreActions>((set) => ({
  authInfo: null,
  isInitialPending: true,

  setAuthState: (newState) => set((state) => ({ ...state, ...newState })),
}));
