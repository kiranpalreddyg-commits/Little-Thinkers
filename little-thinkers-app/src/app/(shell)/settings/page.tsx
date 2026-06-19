'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AccessibilitySettings } from '@/components/settings/AccessibilitySettings';
import { AvatarPicker } from '@/components/avatars/AvatarPicker';
import { useThemeStore } from '@/lib/stores/themeStore';
import type { AvatarId } from '@/lib/stores/themeStore';

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, childProfile } = useAuth();
  const { avatar, setAvatar } = useThemeStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated || !childProfile) {
    return (
      <div className="min-h-screen animate-pulse" aria-busy="true" aria-live="polite">
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-24">
          <div className="h-10 w-36 bg-white/20 rounded-xl mb-8" />
          <div className="bg-white/10 rounded-3xl p-6 space-y-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-5 w-40 bg-gray-200/60 rounded-lg" />
                  <div className="h-3.5 w-56 bg-gray-100/60 rounded-md" />
                </div>
                <div className="h-7 w-12 bg-gray-200/60 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-24">
        <h1 className="text-3xl font-black text-white drop-shadow-md mb-8">Settings</h1>

        {/* Avatar section */}
        <section className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6">
          <h2 className="text-lg font-black text-white mb-1">Your Character</h2>
          <p className="text-sm text-white/70 mb-5">Choose who you want to be</p>
          <AvatarPicker value={avatar} onChange={(id: AvatarId) => setAvatar(id)} />
        </section>

        <AccessibilitySettings childId={childProfile.id} />
      </div>
    </div>
  );
}
