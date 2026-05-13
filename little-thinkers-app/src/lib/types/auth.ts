export interface User {
  id: string;
  email: string;
  role: 'parent' | 'child' | 'admin';
  created_at: string;
  updated_at: string;
  last_login: string;
  is_active: boolean;
}

export interface ChildProfile {
  id: string;
  parent_id: string;
  name: string;
  age: number;
  avatar_url?: string;
  accessibility_settings: Record<string, any>;
  gameplay_mode: 'smart' | 'chill' | 'challenge';
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  childProfile: ChildProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}