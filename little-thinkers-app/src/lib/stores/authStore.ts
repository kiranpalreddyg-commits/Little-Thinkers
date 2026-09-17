import { create } from 'zustand';
import Cookies from 'js-cookie';
import { AuthState, User, ChildProfile, AuthResponse, ApiError } from '@/lib/types/auth';

interface AuthStore extends AuthState {
  // Actions
  login: (response: AuthResponse) => void;
  logout: () => void;
  setChildProfile: (profile: ChildProfile) => void;
  refreshTokens: (accessToken: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initialize: () => void;
}

// Secure cookies are dropped by WebKit over plain http (e.g. a production build served on
// localhost), so key the flag off the actual protocol rather than NODE_ENV.
const isHttps = () => typeof window !== 'undefined' && window.location.protocol === 'https:';

const TOKEN_STORAGE_KEY = 'little-thinkers-tokens';
const USER_STORAGE_KEY = 'little-thinkers-user';
const CHILD_STORAGE_KEY = 'little-thinkers-child';

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  childProfile: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Actions
  login: (response: AuthResponse) => {
    const { user, access_token, refresh_token } = response;

    // Store tokens securely
    Cookies.set('access_token', access_token, {
      expires: 1/24, // 1 hour
      secure: isHttps(),
      sameSite: 'strict'
    });

    Cookies.set('refresh_token', refresh_token, {
      expires: 7, // 7 days
      secure: isHttps(),
      sameSite: 'strict',
      httpOnly: false // js-cookie can't set httpOnly, but we'll use it for refresh
    });

    // Store user data in localStorage for persistence
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    // Set a simple presence cookie readable by Next.js middleware (edge runtime)
    document.cookie = `lt_auth=1; path=/; max-age=86400; SameSite=Lax${isHttps() ? '; Secure' : ''}`;

    set({
      user,
      accessToken: access_token,
      refreshToken: refresh_token,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  },

  logout: () => {
    // Clear all stored data
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    document.cookie = 'lt_auth=; path=/; max-age=0';
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(CHILD_STORAGE_KEY);

    set({
      user: null,
      childProfile: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  },

  setChildProfile: (profile: ChildProfile) => {
    localStorage.setItem(CHILD_STORAGE_KEY, JSON.stringify(profile));
    set({ childProfile: profile });
  },

  refreshTokens: (accessToken: string, refreshToken: string) => {
    Cookies.set('access_token', accessToken, {
      expires: 1/24,
      secure: isHttps(),
      sameSite: 'strict'
    });

    Cookies.set('refresh_token', refreshToken, {
      expires: 7,
      secure: isHttps(),
      sameSite: 'strict'
    });

    set({
      accessToken,
      refreshToken
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error, isLoading: false });
  },

  initialize: () => {
    try {
      // Check for stored tokens and user data
      const accessToken = Cookies.get('access_token');
      const refreshToken = Cookies.get('refresh_token');
      const userData = localStorage.getItem(USER_STORAGE_KEY);
      const childData = localStorage.getItem(CHILD_STORAGE_KEY);

      if (accessToken && userData) {
        const user = JSON.parse(userData);
        const childProfile = childData ? JSON.parse(childData) : null;

        // Re-mint the middleware presence cookie so it stays in sync with access_token
        document.cookie = `lt_auth=1; path=/; max-age=86400; SameSite=Lax${isHttps() ? '; Secure' : ''}`;

        set({
          user,
          childProfile,
          accessToken,
          refreshToken: refreshToken || null,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        // Clear any partial data
        get().logout();
      }
    } catch (error) {
      console.error('Error initializing auth store:', error);
      get().logout();
    }
  }
}));