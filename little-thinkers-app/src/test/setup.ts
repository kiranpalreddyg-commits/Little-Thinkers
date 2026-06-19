import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('posthog-js', () => ({
  default: {
    init: vi.fn(),
    capture: vi.fn(),
    identify: vi.fn(),
    reset: vi.fn(),
    isFeatureEnabled: vi.fn(),
    onFeatureFlags: vi.fn(),
    getFeatureFlag: vi.fn(),
  },
}));

vi.mock('posthog-js/react', () => ({
  PostHogProvider: ({ children }: { children: React.ReactNode }) => children,
  usePostHog: () => ({ capture: vi.fn(), identify: vi.fn(), reset: vi.fn() }),
}));
