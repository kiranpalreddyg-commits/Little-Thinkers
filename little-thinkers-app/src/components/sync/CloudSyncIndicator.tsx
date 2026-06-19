'use client';

import { useState, useEffect, useCallback } from 'react';
import { syncProgress, syncProgressWithRetry, SyncStatus } from '@/lib/utils/syncManager';

interface CloudSyncIndicatorProps {
  childId: string;
  autoSync?: boolean;
}

export function CloudSyncIndicator({ childId, autoSync = true }: CloudSyncIndicatorProps) {
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const triggerSync = useCallback(async () => {
    setStatus('syncing');
    setErrorMessage('');
    const result = await syncProgress(childId);
    if (result.success) {
      setStatus('synced');
    } else {
      setStatus('error');
      setErrorMessage(result.error ?? 'Sync failed');
    }
  }, [childId]);

  const handleRetry = useCallback(async () => {
    setStatus('syncing');
    setErrorMessage('');
    const result = await syncProgressWithRetry(childId);
    if (result.success) {
      setStatus('synced');
    } else {
      setStatus('error');
      setErrorMessage(result.error ?? 'Sync failed after retries');
    }
  }, [childId]);

  useEffect(() => {
    if (autoSync) triggerSync();
  }, [autoSync, triggerSync]);

  if (status === 'idle') return null;

  return (
    <div data-testid="cloud-sync-indicator" aria-live="polite" className="flex items-center gap-2 text-sm">
      {status === 'syncing' && (
        <span data-testid="sync-status-syncing" className="flex items-center gap-1 text-blue-600">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Syncing…
        </span>
      )}
      {status === 'synced' && (
        <span data-testid="sync-status-success" className="flex items-center gap-1 text-green-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Progress saved
        </span>
      )}
      {status === 'error' && (
        <span data-testid="sync-status-error" className="flex items-center gap-2 text-red-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {errorMessage}
          <button
            type="button"
            data-testid="sync-retry-button"
            onClick={handleRetry}
            className="text-xs underline font-medium"
          >
            Retry
          </button>
        </span>
      )}
    </div>
  );
}
