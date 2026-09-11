'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { AccessibilitySettings } from '@/components/settings/AccessibilitySettings';
import { ThemeGrid } from '@/components/settings/ThemeGrid';
import { Avatar } from '@/components/avatars';
import { useThemeStore } from '@/lib/stores/themeStore';
import { useRewardsStore } from '@/lib/stores/rewardsStore';
import { AVATAR_COUNT } from '@/lib/avatars/manifest';
import { useAccessibility } from '@/hooks/useAccessibility';

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, childProfile } = useAuth();
  const avatar = useThemeStore((s) => s.avatar);
  const sparks = useRewardsStore((s) => s.brainJar?.totalSparks ?? 0);
  const reducedMotion = useAccessibility().settings.reducedMotion;

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
        {/* Profile header */}
        <div className="mb-5 flex items-center gap-4">
          <Avatar id={avatar} size={58} />
          <div>
            <h1 className="text-[26px] font-bold leading-[1.1]" style={{ color: 'var(--theme-on-ground)' }}>
              {childProfile.name}
            </h1>
            <p className="text-sm font-semibold" style={{ color: 'var(--theme-on-ground)', opacity: 0.85 }}>
              {sparks} sparks
            </p>
          </div>
        </div>

        {/* Your character → Characters screen */}
        <Link
          href="/settings/characters"
          className={`mb-4 flex items-center justify-between rounded-[22px] border-[3px] px-[13px] py-[11px] transition-transform ${reducedMotion ? '' : 'active:translate-y-[4px]'}`}
          style={{
            backgroundColor: 'var(--theme-card)',
            borderColor: 'var(--theme-line)',
            boxShadow: '0 6px 0 var(--theme-shadow)',
          }}
        >
          <span>
            <span className="block text-base font-semibold" style={{ color: 'var(--theme-ink)', fontFamily: 'var(--font-display)' }}>
              Your character
            </span>
            <span className="block text-[12.5px] font-bold" style={{ color: 'var(--theme-ink)', opacity: 0.55 }}>
              {AVATAR_COUNT} to choose from
            </span>
          </span>
          <span className="flex items-center gap-2">
            <Avatar id={avatar} size={36} />
            <span aria-hidden="true" className="text-xl font-extrabold" style={{ color: 'var(--theme-accent)' }}>›</span>
          </span>
        </Link>

        <div className="mb-6">
          <ThemeGrid />
        </div>

        <AccessibilitySettings childId={childProfile.id} />
      </div>
    </div>
  );
}
