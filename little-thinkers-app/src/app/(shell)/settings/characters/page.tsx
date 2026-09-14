'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useAppShell } from '@/components/navigation/AppShellContext';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Avatar } from '@/components/avatars';
import { AvatarPicker } from '@/components/avatars/AvatarPicker';
import { useAccessibility } from '@/hooks/useAccessibility';

export default function CharactersPage() {
  const router = useRouter();
  const { setHideTabBar, setHideHeader } = useAppShell();
  const { avatar, setAvatar } = useThemeStore();
  const reducedMotion = useAccessibility().settings.reducedMotion;

  // Own header bar, no tab bar — same mechanism gameplay uses.
  useEffect(() => {
    setHideTabBar(true);
    setHideHeader(true);
    return () => {
      setHideTabBar(false);
      setHideHeader(false);
    };
  }, [setHideTabBar, setHideHeader]);

  return (
    <div className="min-h-screen">
      <header
        className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b-[3px] px-4"
        style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-line)' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className={`flex h-11 w-11 items-center justify-center rounded-[14px] border-[3px] ${reducedMotion ? '' : 'active:scale-[.88]'}`}
          style={{
            backgroundColor: 'var(--theme-tint)',
            borderColor: 'var(--theme-line)',
            color: 'var(--theme-accent)',
            transition: 'transform .16s cubic-bezier(.22,1,.36,1)',
          }}
        >
          <ChevronLeft size={22} strokeWidth={3} aria-hidden="true" />
        </button>
        <h1 className="text-[19px] font-bold" style={{ color: 'var(--theme-ink)' }}>
          Your character
        </h1>
      </header>

      <div className="mx-auto max-w-2xl px-5 pb-8 pt-5">
        <div className="mb-5 flex items-center gap-4">
          <Avatar id={avatar} size={72} />
          <div>
            <p className="text-base font-bold" style={{ color: 'var(--theme-on-ground)' }}>
              Playing as this one
            </p>
            <p className="text-sm font-semibold" style={{ color: 'var(--theme-on-ground)', opacity: 0.85 }}>
              Tap any character to switch
            </p>
          </div>
        </div>
        <AvatarPicker value={avatar} onChange={setAvatar} />
      </div>
    </div>
  );
}
