import { mockDb, generateMockTokens, MOCK_GAMES, MOCK_STORIES, MOCK_SCIENCE_TOPICS, MOCK_DAILY_PUZZLE } from './mockDb';

const MOCK_API_DELAY = 300; // Simulate network delay

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function mockApiCall<T>(
  endpoint: string,
  method: string,
  body?: any
): Promise<T> {
  // Add simulated network delay for realism
  await delay(MOCK_API_DELAY);

  try {
    // Login endpoint
    if (endpoint === '/auth/login' && method === 'POST') {
      const { email, password } = body;
      const parent = mockDb.loginParent(email, password);
      const tokens = generateMockTokens(parent.id);

      return {
        user: {
          id: parent.id,
          email: parent.email,
          role: parent.role,
          created_at: parent.created_at,
          updated_at: parent.updated_at,
          last_login: parent.last_login,
          is_active: parent.is_active,
        },
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_type: tokens.token_type,
        expires_in: tokens.expires_in,
      } as T;
    }

    // Register endpoint
    if (endpoint === '/auth/register' && method === 'POST') {
      const { email, password } = body;
      const parent = mockDb.registerParent(email, password);
      const tokens = generateMockTokens(parent.id);

      return {
        user: {
          id: parent.id,
          email: parent.email,
          role: parent.role,
          created_at: parent.created_at,
          updated_at: parent.updated_at,
          last_login: parent.last_login,
          is_active: parent.is_active,
        },
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_type: tokens.token_type,
        expires_in: tokens.expires_in,
      } as T;
    }

    // Refresh token endpoint
    if (endpoint === '/auth/refresh' && method === 'POST') {
      const tokens = generateMockTokens('parent-1'); // Mock refresh
      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      } as T;
    }

    // Get children endpoint
    if (endpoint.match(/^\/children\/?$/) && method === 'GET') {
      // Extract user ID from context - for mock, always use parent-1
      const children = mockDb.getChildren('parent-1');
      return children as T;
    }

    // Get specific child endpoint
    if (endpoint.match(/^\/children\/(.+)$/) && method === 'GET') {
      const match = endpoint.match(/^\/children\/(.+)$/);
      const childId = match?.[1];

      if (!childId) {
        throw new Error('Child ID is required');
      }

      const child = mockDb.getChild(childId);

      if (!child) {
        throw new Error('Child profile not found');
      }

      return child as T;
    }

    // Create child endpoint
    if (endpoint === '/children' && method === 'POST') {
      const { name, age, gameplay_mode } = body;
      const newChild = mockDb.createChild('parent-1', name, age, gameplay_mode);
      return newChild as T;
    }

    // Games list endpoint
    if (endpoint === '/games' && method === 'GET') {
      return MOCK_GAMES as T;
    }

    // Daily puzzle endpoint
    if (endpoint === '/content/puzzles/daily' && method === 'GET') {
      return MOCK_DAILY_PUZZLE as T;
    }

    // Stories list endpoint (supports ?topic=&ageMin=&ageMax= query params)
    if (endpoint.startsWith('/content/stories') && method === 'GET') {
      const url = new URL(`http://mock${endpoint}`);
      const topic = url.searchParams.get('topic') || '';
      const ageMin = parseInt(url.searchParams.get('ageMin') || '7', 10);
      const ageMax = parseInt(url.searchParams.get('ageMax') || '15', 10);

      const filtered = MOCK_STORIES.filter((s) => {
        const inAge = s.ageRange.min <= ageMax && s.ageRange.max >= ageMin;
        const matchesTopic = !topic || s.cognitiveSkills.includes(topic as any);
        return inAge && matchesTopic;
      });
      return filtered as T;
    }

    // Science topics endpoint (supports ?topic=&ageMin=&ageMax= query params)
    if (endpoint.startsWith('/content/science') && method === 'GET') {
      const url = new URL(`http://mock${endpoint}`);
      const topic = url.searchParams.get('topic') || '';
      const ageMin = parseInt(url.searchParams.get('ageMin') || '7', 10);
      const ageMax = parseInt(url.searchParams.get('ageMax') || '15', 10);

      const filtered = MOCK_SCIENCE_TOPICS.filter((s) => {
        const inAge = s.ageRange.min <= ageMax && s.ageRange.max >= ageMin;
        const matchesTopic = !topic || s.cognitiveSkills.includes(topic as any);
        return inAge && matchesTopic;
      });
      return filtered as T;
    }

    // Unknown endpoint
    throw new Error(`Unknown endpoint: ${method} ${endpoint}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw error;
  }
}