'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Palette, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Avatar } from '@/components/avatars';
import { ALL_AVATARS } from '@/lib/avatars/manifest';

interface AppHeaderProps {
  sparkCount?: number;
}

export function AppHeader({ sparkCount = 0 }: AppHeaderProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const { cycleTheme, avatar, setAvatar } = useThemeStore();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b-[3px] shadow-md"
        style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-line)' }}
      >
        <div className="flex items-center justify-between px-4 h-16 gap-3">
          {/* Left: logo icon + brand name */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="transition-opacity hover:opacity-80"
              aria-label="Little Thinkers home"
            >
              <span
                className="text-xl font-black tracking-tight"
                style={{ color: 'var(--theme-ink)' }}
              >
                Little Thinkers
              </span>
            </Link>
          </div>

          {/* Right: sparks + avatar + palette + sign out */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-[3px]"
              style={{
                backgroundColor: 'var(--theme-card)',
                borderColor: 'var(--theme-line)',
                boxShadow: '0 4px 0 var(--theme-shadow)',
              }}
            >
              <span aria-hidden="true">⚡</span>
              <span
                data-testid="spark-count"
                className="font-black text-sm"
                style={{ color: 'var(--theme-ink)' }}
                aria-live="polite"
                aria-atomic="true"
              >
                {sparkCount}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              aria-label="Choose avatar"
              data-testid="avatar"
              className="rounded-full transition-transform active:scale-95"
            >
              <Avatar id={avatar} size={44} />
            </button>

            <button
              type="button"
              onClick={cycleTheme}
              aria-label="Change color theme"
              className="w-10 h-10 rounded-xl border-[3px] flex items-center justify-center transition-transform active:scale-95"
              style={{
                borderColor: 'var(--theme-line)',
                color: 'var(--theme-ink)',
                backgroundColor: 'var(--theme-tint)',
              }}
            >
              <Palette size={18} />
            </button>

            <button
              type="button"
              onClick={() => { logout(); router.push('/login'); }}
              style={{ color: 'var(--theme-muted)' }}
              className="text-xs hover:opacity-70 transition-opacity px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
            >
              Out
            </button>
          </div>
        </div>
      </header>

      {/* Avatar selection modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-[2rem] border-[3px] p-6 relative"
            style={{
              backgroundColor: 'var(--theme-card)',
              borderColor: 'var(--theme-line)',
              boxShadow: '0 12px 0 var(--theme-shadow)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              aria-label="Close avatar picker"
              className="absolute top-4 right-4 w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X size={18} strokeWidth={3} />
            </button>
            <h3
              className="text-2xl font-black mb-6 text-center"
              style={{ color: 'var(--theme-ink)' }}
            >
              Choose your friend!
            </h3>
            <div className="grid grid-cols-4 gap-3 max-h-80 overflow-y-auto">
              {ALL_AVATARS.map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-label={`Character ${id}`}
                  aria-pressed={avatar === id}
                  onClick={() => {
                    setAvatar(id);
                    setModalOpen(false);
                  }}
                  className="flex justify-center transition-transform active:scale-[.88]"
                >
                  <Avatar id={id} size={64} selected={avatar === id} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
