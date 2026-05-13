import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

vi.mock('js-cookie', () => ({
  default: { get: vi.fn(() => 'mock-token'), set: vi.fn(), remove: vi.fn() },
}));

vi.stubEnv('NEXT_PUBLIC_USE_MOCK_API', 'true');

// Vitest 4 passes an invalid --localstorage-file to jsdom, breaking its built-in
// localStorage. Stub it with a plain in-memory implementation so mockDb works.
const _store: Record<string, string> = {};
const _localStorage = {
  getItem: (key: string) => _store[key] ?? null,
  setItem: (key: string, value: string) => { _store[key] = value; },
  removeItem: (key: string) => { delete _store[key]; },
  clear: () => { Object.keys(_store).forEach(k => delete _store[k]); },
  get length() { return Object.keys(_store).length; },
  key: (n: number) => Object.keys(_store)[n] ?? null,
};

beforeAll(() => {
  vi.stubGlobal('localStorage', _localStorage);
});

describe('auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock DB so each test starts with the seed data
    _localStorage.clear();
  });

  it('login returns user and tokens for valid credentials', async () => {
    const { apiClient } = await import('@/lib/api/auth');
    const response = await apiClient.login('james@example.com', 'password123');
    expect(response.user.email).toBe('james@example.com');
    expect(response.user.role).toBe('parent');
    expect(response.access_token).toBeTruthy();
    expect(response.refresh_token).toBeTruthy();
    expect(response.token_type).toBe('Bearer');
    expect(response.expires_in).toBeGreaterThan(0);
  });

  it('login throws for invalid credentials', async () => {
    const { apiClient } = await import('@/lib/api/auth');
    await expect(apiClient.login('nobody@example.com', 'wrongpass')).rejects.toThrow(
      'Invalid email or password'
    );
  });

  it('register creates a new parent account and returns tokens', async () => {
    const { apiClient } = await import('@/lib/api/auth');
    const response = await apiClient.register('newparent@example.com', 'securepass123');
    expect(response.user.email).toBe('newparent@example.com');
    expect(response.user.role).toBe('parent');
    expect(response.access_token).toBeTruthy();
  });

  it('register throws when email is already registered', async () => {
    const { apiClient } = await import('@/lib/api/auth');
    // james@example.com is a seed account in the default mock DB
    await expect(apiClient.register('james@example.com', 'anotherpass')).rejects.toThrow(
      'Email already registered'
    );
  });

  it('getChildren returns child profiles for the authenticated parent', async () => {
    const { apiClient } = await import('@/lib/api/auth');
    const children = await apiClient.getChildren();
    expect(children.length).toBeGreaterThan(0);
    expect(children[0]).toHaveProperty('id');
    expect(children[0]).toHaveProperty('name');
    expect(children[0]).toHaveProperty('age');
    expect(children[0]).toHaveProperty('gameplay_mode');
  });

  it('getChildren returns profiles with valid gameplay modes', async () => {
    const { apiClient } = await import('@/lib/api/auth');
    const children = await apiClient.getChildren();
    const validModes = ['smart', 'chill', 'challenge'];
    for (const child of children) {
      expect(validModes).toContain(child.gameplay_mode);
    }
  });
});
