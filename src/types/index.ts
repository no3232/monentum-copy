export interface Task {
  id: string;
  title: string;
  status: 'needsAction' | 'completed';
  updated?: string;
  notes?: string;
  due?: string;
}

export interface UnsplashImage {
  urls: {
    regular: string;
    full: string;
  };
  user: {
    name: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  picture?: string;
}

export interface GoogleAuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}
