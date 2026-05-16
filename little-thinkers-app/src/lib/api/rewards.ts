import Cookies from 'js-cookie';
import type { BrainJar, ThoughtSpark, SparkSource } from '@/lib/types/rewards';
import { mockApiCall } from './mockApiHandler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

async function request<T>(endpoint: string, method: string, body?: unknown): Promise<T> {
  if (USE_MOCK_API) {
    return mockApiCall<T>(endpoint, method, body);
  }

  const accessToken = Cookies.get('access_token');
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      return mockApiCall<T>(endpoint, method, body);
    }
    throw error;
  }
}

export async function fetchBrainJar(childId: string): Promise<BrainJar> {
  return request<BrainJar>(`/rewards/brainjar/${childId}`, 'GET');
}

export async function postEarnSpark(
  childId: string,
  source: SparkSource,
  amount: number,
  gameType?: string,
): Promise<ThoughtSpark> {
  return request<ThoughtSpark>('/rewards/sparks', 'POST', { childId, source, amount, gameType });
}
