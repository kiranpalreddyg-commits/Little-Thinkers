'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AccessibilitySettings } from '@/components/settings/AccessibilitySettings';

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, childProfile } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        aria-live="polite"
        aria-busy="true"
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"
          role="status"
        >
          <span className="sr-only">Loading…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !childProfile) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        <AccessibilitySettings childId={childProfile.id} />
      </div>
    </main>
  );
}
