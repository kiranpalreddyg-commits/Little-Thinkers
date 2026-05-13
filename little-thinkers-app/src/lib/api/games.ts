import Cookies from 'js-cookie';
import { Game } from '@/lib/types/content';
import { mockApiCall } from './mockApiHandler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

async function request<T>(endpoint: string): Promise<T> {
  if (USE_MOCK_API) {
    return mockApiCall<T>(endpoint, 'GET');
  }

  const accessToken = Cookies.get('access_token');
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      return mockApiCall<T>(endpoint, 'GET');
    }
    throw error;
  }
}

export async function fetchGames(): Promise<Game[]> {
  return request<Game[]>('/games');
}
