/**
 * Story 3.1 — RED tests: Cloud Sync
 *
 * AC: progress syncs immediately when online, success indicator shown,
 *     failure notification visible, retry logic on delay
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

vi.mock('@/lib/api/auth', () => ({
  apiClient: { syncProgress: vi.fn() },
}));

import { apiClient } from '@/lib/api/auth';
import { CloudSyncIndicator } from '@/components/sync/CloudSyncIndicator';

describe('CloudSyncIndicator — Story 3.1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('AC: shows syncing indicator while sync is in progress', async () => {
    vi.mocked(apiClient.syncProgress).mockImplementation(() => new Promise(() => {})); // never resolves
    await act(async () => { render(<CloudSyncIndicator childId="child-1" autoSync />); });
    expect(screen.getByTestId('sync-status-syncing')).toBeInTheDocument();
  });

  it('AC: shows success indicator after sync completes', async () => {
    vi.mocked(apiClient.syncProgress).mockResolvedValue({ synced: true });
    await act(async () => { render(<CloudSyncIndicator childId="child-1" autoSync />); });
    expect(screen.getByTestId('sync-status-success')).toBeInTheDocument();
  });

  it('AC: shows error indicator on sync failure', async () => {
    vi.mocked(apiClient.syncProgress).mockRejectedValue(new Error('Network error'));
    await act(async () => { render(<CloudSyncIndicator childId="child-1" autoSync />); });
    expect(screen.getByTestId('sync-status-error')).toBeInTheDocument();
  });

  it('AC: shows retry button on failure', async () => {
    vi.mocked(apiClient.syncProgress).mockRejectedValue(new Error('Network error'));
    await act(async () => { render(<CloudSyncIndicator childId="child-1" autoSync />); });
    expect(screen.getByTestId('sync-retry-button')).toBeInTheDocument();
  });

  it('AC: clicking retry triggers another sync attempt', async () => {
    // First call fails (initial sync), subsequent calls succeed (retry)
    vi.mocked(apiClient.syncProgress)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValue({ synced: true });
    await act(async () => { render(<CloudSyncIndicator childId="child-1" autoSync />); });
    expect(screen.getByTestId('sync-retry-button')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByTestId('sync-retry-button'));
    });
    // syncProgressWithRetry succeeds on its first inner attempt (call #2 overall)
    expect(screen.getByTestId('sync-status-success')).toBeInTheDocument();
  });

  it('AC: cloud-sync-indicator has aria-live for accessibility', async () => {
    vi.mocked(apiClient.syncProgress).mockResolvedValue({ synced: true });
    await act(async () => { render(<CloudSyncIndicator childId="child-1" autoSync />); });
    expect(screen.getByTestId('cloud-sync-indicator')).toHaveAttribute('aria-live', 'polite');
  });
});
