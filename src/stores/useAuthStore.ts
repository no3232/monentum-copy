import { create } from 'zustand';
import type { UserProfile } from '../types';
import { setAccessToken } from '../lib/googleApi';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'momentum_access_token',
  USER_PROFILE: 'momentum_user_profile',
  TOKEN_EXPIRY: 'momentum_token_expiry',
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
  
  // Session persistence
  saveSession: (accessToken: string, userProfile: UserProfile, expiresIn: number) => void;
  restoreSession: () => boolean;
  clearSession: () => void;
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
    get().clearSession();
    setAccessToken(null);
    set({
      isAuthenticated: false,
      accessToken: null,
      userProfile: null,
      error: null,
    });
  },
  
  saveSession: (accessToken, userProfile, expiresIn) => {
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
  },
  
  restoreSession: () => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const storedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    const storedExpiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    
    if (storedToken && storedProfile && storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      const now = Date.now();
      
      if (now < expiryTime) {
        const profile: UserProfile = JSON.parse(storedProfile);
        
        // googleApi에 토큰 설정
        setAccessToken(storedToken);
        
        set({
          isAuthenticated: true,
          accessToken: storedToken,
          userProfile: profile,
          isLoading: false,
          error: null,
        });
        
        return true;
      } else {
        // 토큰 만료
        get().clearSession();
      }
    }
    
    set({ isLoading: false });
    return false;
  },
  
  clearSession: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
  },
}));
