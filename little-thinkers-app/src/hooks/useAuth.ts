import { useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { useAuthStore } from '@/lib/stores/authStore';
import { apiClient } from '@/lib/api/auth';
import { LoginCredentials, AuthResponse, ChildProfile } from '@/lib/types/auth';

export const useAuth = () => {
  const {
    user,
    childProfile,
    isAuthenticated,
    isLoading,
    error,
    login: storeLogin,
    logout: storeLogout,
    setChildProfile,
    setLoading,
    setError,
    initialize,
  } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response: AuthResponse = await apiClient.login(
        credentials.email,
        credentials.password
      );

      storeLogin(response);
      posthog.identify(response.user.id, { email: response.user.email, role: response.user.role });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response: AuthResponse = await apiClient.register(email, password);
      storeLogin(response);
      posthog.identify(response.user.id, { email: response.user.email, role: response.user.role });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    posthog.capture('user_logged_out');
    posthog.reset();
    storeLogout();
  };

  const selectChildProfile = (profile: ChildProfile) => {
    setChildProfile(profile);
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      setLoading(true);
      await apiClient.refresh();
      // The API client handles updating cookies, store will be updated via initialize
      initialize();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Token refresh failed';
      setError(message);
      logout(); // Force logout on refresh failure
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    user,
    childProfile,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    signup,
    logout,
    selectChildProfile,
    refreshAuth,
  };
};

export const useChildProfiles = () => {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await apiClient.getChildren();
      setProfiles(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch profiles';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return {
    profiles,
    isLoading,
    error,
    refetch: fetchProfiles,
  };
};