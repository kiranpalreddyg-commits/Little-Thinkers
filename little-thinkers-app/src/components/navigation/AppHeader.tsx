'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Palette, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStore } from '@/lib/stores/themeStore';
import { AVATARS } from '@/components/avatars';
import type { AvatarId } from '@/lib/stores/themeStore';

interface AppHeaderProps {
  sparkCount?: number;
}

export function AppHeader({ sparkCount = 0 }: AppHeaderProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const { cycleTheme, avatar, setAvatar } = useThemeStore();
  const [modalOpen, setModalOpen] = useState(false);
  const avatarEntry = AVATARS.find((a) => a.id === avatar) ?? AVATARS[0];
  const ActiveAvatar = avatarEntry.component;

  return (
    <>
      <header
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-[3px] shadow-md"
        style={{ borderColor: 'var(--theme-border)' }}
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
                style={{ color: 'var(--theme-text)' }}
              >
                Little Thinkers
              </span>
            </Link>
          </div>

          {/* Right: sparks + avatar + palette + sign out */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-2xl border-[3px]"
              style={{
                borderColor: 'var(--theme-border)',
                boxShadow: '0 4px 0 var(--theme-shadow)',
              }}
            >
              <span aria-hidden="true">⚡</span>
              <span
                data-testid="spark-count"
                className="font-black text-sm"
                style={{ color: 'var(--theme-text)' }}
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
              className="w-11 h-11 bg-white rounded-2xl border-[3px] flex items-center justify-center overflow-hidden transition-transform active:scale-95"
              style={{
                borderColor: 'var(--theme-border)',
                boxShadow: '0 4px 0 var(--theme-shadow)',
              }}
            >
              <ActiveAvatar className="w-8 h-8 mt-1" />
            </button>

            <button
              type="button"
              onClick={cycleTheme}
              aria-label="Change color theme"
              className="w-10 h-10 rounded-xl border-[3px] flex items-center justify-center transition-transform active:scale-95"
              style={{
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-text)',
                backgroundColor: 'var(--theme-card-bg)',
              }}
            >
              <Palette size={18} />
            </button>

            <button
              type="button"
              onClick={() => { logout(); router.push('/login'); }}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
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
            className="bg-white w-full max-w-sm rounded-[2rem] border-[3px] p-6 relative"
            style={{
              borderColor: 'var(--theme-border)',
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
              style={{ color: 'var(--theme-text)' }}
            >
              Choose your friend!
            </h3>
            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {AVATARS.map(({ id, component: AvatarComp, name }) => (
                <button
                  key={id}
                  onClick={() => {
                    setAvatar(id as AvatarId);
                    setModalOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-[1.5rem] border-[3px] transition-transform active:scale-95 ${
                    avatar === id ? 'bg-slate-50' : 'bg-white'
                  }`}
                  style={{
                    borderColor: avatar === id ? 'var(--theme-border)' : '#E2E8F0',
                  }}
                >
                  <AvatarComp className="w-20 h-20 mb-2" />
                  <span className="font-bold text-slate-700 text-sm">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
