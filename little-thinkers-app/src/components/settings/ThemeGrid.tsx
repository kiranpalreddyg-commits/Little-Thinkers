'use client';

import { THEMES } from '@/lib/theme/themes';
import { useThemeStore } from '@/lib/stores/themeStore';

/** 24-swatch theme picker card (design 4a §2). */
export function ThemeGrid() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const current = THEMES.find((t) => t.id === theme);

  return (
    <section
      aria-labelledby="theme-grid-label"
      className="rounded-[22px] border-[3px] p-[13px]"
      style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-line)' }}
    >
      <div className="flex items-baseline justify-between mb-3">
        <h3 id="theme-grid-label" className="text-base font-semibold" style={{ color: 'var(--theme-ink)' }}>
          Theme
        </h3>
        <span className="text-xs font-bold" style={{ color: 'var(--theme-muted)' }}>{current?.name}</span>
      </div>
      <div
        role="radiogroup"
        aria-labelledby="theme-grid-label"
        className="grid gap-[9px]"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(34px, 1fr))' }}
      >
        {THEMES.map((t) => {
          const selected = t.id === theme;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={t.name}
              onClick={() => setTheme(t.id)}
              className="flex h-[34px] w-[34px] overflow-hidden rounded-full border-[3px] active:scale-[.88]"
              style={{
                borderColor: selected ? 'var(--theme-accent)' : 'var(--theme-tint)',
                transition: 'transform .16s cubic-bezier(.22,1,.36,1)',
              }}
            >
              <span className="h-full w-1/2" style={{ backgroundColor: t.sw1 }} />
              <span className="h-full w-1/2" style={{ backgroundColor: t.sw2 }} />
            </button>
          );
        })}
      </div>
    </section>
  );
}
