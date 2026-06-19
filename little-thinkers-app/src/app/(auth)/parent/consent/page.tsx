'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api/auth';
import type { ChildProfile } from '@/lib/types/auth';

export default function ConsentPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiClient
      .getChildren()
      .then(setChildren)
      .catch(() => setError('Failed to load child profiles.'))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  async function handleConsentUpdate(child: ChildProfile, consented: boolean) {
    setUpdatingId(child.id);
    setError(null);
    try {
      const updated = await apiClient.updateChildConsent(child.id, consented);
      setChildren((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch {
      setError('Failed to update consent. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">COPPA Consent Management</h1>
        <p className="text-gray-600 mb-8">
          Review and manage your COPPA consent for each child profile.
        </p>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        {children.length === 0 ? (
          <p className="text-gray-500">No child profiles found.</p>
        ) : (
          <ul className="space-y-4">
            {children.map((child) => (
              <li
                key={child.id}
                data-child-id={child.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">{child.name}</p>
                  <p className="text-sm text-gray-500">Age {child.age}</p>
                  <p
                    className={`text-xs font-semibold mt-1 ${
                      child.coppa_consented ? 'text-green-600' : 'text-amber-600'
                    }`}
                  >
                    {child.coppa_consented ? 'Consent granted' : 'Consent not granted'}
                  </p>
                </div>

                {child.coppa_consented ? (
                  <button
                    type="button"
                    aria-label={`Withdraw consent for ${child.name}`}
                    disabled={updatingId === child.id}
                    onClick={() => handleConsentUpdate(child, false)}
                    className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-300 rounded-lg
                      hover:bg-red-50 focus:ring-2 focus:ring-red-400 focus:ring-offset-2
                      disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updatingId === child.id ? 'Updating…' : `Withdraw for ${child.name}`}
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label={`Grant consent for ${child.name}`}
                    disabled={updatingId === child.id}
                    onClick={() => handleConsentUpdate(child, true)}
                    className="px-4 py-2 text-sm font-semibold text-green-700 border border-green-300 rounded-lg
                      hover:bg-green-50 focus:ring-2 focus:ring-green-400 focus:ring-offset-2
                      disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updatingId === child.id ? 'Updating…' : `Grant consent for ${child.name}`}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
