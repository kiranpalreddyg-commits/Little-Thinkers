import Cookies from 'js-cookie';
import { AuthResponse, ApiError, ChildProfile } from '@/lib/types/auth';
import { mockApiCall } from './mockApiHandler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Use mock API if enabled or as fallback
    if (USE_MOCK_API) {
      return mockApiCall<T>(endpoint, options.method || 'GET', options.body ? JSON.parse(options.body as string) : undefined);
    }

    const url = `${this.baseURL}${endpoint}`;

    // Get access token from cookies
    const accessToken = Cookies.get('access_token');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
          code: 'HTTP_ERROR'
        }));

        // Handle token refresh on 401
        if (response.status === 401 && accessToken) {
          // Try to refresh token
          try {
            await this.refreshToken();
            // Retry the original request
            const retryConfig = {
              ...config,
              headers: {
                ...config.headers,
                Authorization: `Bearer ${Cookies.get('access_token')}`,
              },
            };
            const retryResponse = await fetch(url, retryConfig);
            if (retryResponse.ok) {
              return retryResponse.json();
            }
          } catch (refreshError) {
            // Refresh failed, throw original error
          }
        }

        throw new Error(errorData.message || 'API request failed');
      }

      return response.json();
    } catch (error) {
      // Fallback to mock API if real API fails
      if (!USE_MOCK_API && error instanceof Error && error.message.includes('Failed to fetch')) {
        console.warn('Real API unavailable, falling back to mock API');
        return mockApiCall<T>(endpoint, options.method || 'GET', options.body ? JSON.parse(options.body as string) : undefined);
      }
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = Cookies.get('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data: { access_token: string; refresh_token: string } = await response.json();

    // Update cookies
    Cookies.set('access_token', data.access_token, {
      expires: 1/24,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    Cookies.set('refresh_token', data.refresh_token, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async refresh(): Promise<{ access_token: string; refresh_token: string }> {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  // Profile endpoints
  async getChildren(): Promise<ChildProfile[]> {
    return this.request<ChildProfile[]>('/children');
  }

  async getChildProfile(id: string): Promise<ChildProfile> {
    return this.request<ChildProfile>(`/children/${id}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);