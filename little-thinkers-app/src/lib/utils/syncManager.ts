import { apiClient } from '@/lib/api/auth';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export interface SyncResult {
  success: boolean;
  error?: string;
}

export async function syncProgress(childId: string): Promise<SyncResult> {
  try {
    await apiClient.syncProgress(childId);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Sync failed' };
  }
}

export async function syncProgressWithRetry(
  childId: string,
  maxRetries = 3,
): Promise<SyncResult> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await syncProgress(childId);
    if (result.success) return result;
    if (attempt < maxRetries) {
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  return { success: false, error: 'Sync failed after retries' };
}
