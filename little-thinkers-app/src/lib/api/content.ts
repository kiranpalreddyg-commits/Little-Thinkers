import Cookies from 'js-cookie';
import { DailyPuzzle, Story, ScienceTopic, ContentFilter } from '@/lib/types/content';
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

function buildFilterQuery(filter?: Partial<ContentFilter>): string {
  if (!filter) return '';
  const params = new URLSearchParams();
  if (filter.topic) params.set('topic', filter.topic);
  if (filter.ageMin !== undefined) params.set('ageMin', String(filter.ageMin));
  if (filter.ageMax !== undefined) params.set('ageMax', String(filter.ageMax));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function fetchDailyPuzzle(): Promise<DailyPuzzle> {
  return request<DailyPuzzle>('/content/puzzles/daily');
}

export async function fetchStories(filter?: Partial<ContentFilter>): Promise<Story[]> {
  return request<Story[]>(`/content/stories${buildFilterQuery(filter)}`);
}

export async function fetchScienceTopics(filter?: Partial<ContentFilter>): Promise<ScienceTopic[]> {
  return request<ScienceTopic[]>(`/content/science${buildFilterQuery(filter)}`);
}
