import { create } from "zustand";
import type { UserProfile } from "../types";
import { setAccessToken } from "../lib/googleApi";

const STORAGE_KEYS = {
  USER_PROFILE: "momentum_user_profile",
};

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAuth: (data: {
    isAuthenticated: boolean;
    accessToken: string | null;
    userProfile: UserProfile | null;
  }) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;

  // Profile persistence (토큰은 Chrome이 관리)
  saveUserProfile: (userProfile: UserProfile) => void;
  restoreUserProfile: () => UserProfile | null;
  clearUserProfile: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  accessToken: null,
  userProfile: null,
  isLoading: true,
  error: null,

  setAuth: ({ isAuthenticated, accessToken, userProfile }) =>
    set({ isAuthenticated, accessToken, userProfile, error: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  logout: () => {
    get().clearUserProfile();
    setAccessToken(null);
    set({
      isAuthenticated: false,
      accessToken: null,
      userProfile: null,
      error: null,
    });
  },

  // 프로필만 저장 (토큰은 Chrome Identity API가 관리)
  saveUserProfile: (userProfile) => {
    localStorage.setItem(
      STORAGE_KEYS.USER_PROFILE,
      JSON.stringify(userProfile)
    );
  },

  // 저장된 프로필 복원
  restoreUserProfile: () => {
    const storedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (storedProfile) {
      try {
        return JSON.parse(storedProfile) as UserProfile;
      } catch {
        return null;
      }
    }
    return null;
  },

  clearUserProfile: () => {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  },
}));
