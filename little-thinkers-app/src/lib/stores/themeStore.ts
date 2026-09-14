// src/lib/stores/themeStore.ts — drop-in replacement (4a)
// Changes from the current store:
//   * ThemeId union widened from 4 to 24 ids (see lib/theme/themes.ts)
//   * AvatarId is now a string key into the PNG manifest, not a component union
//   * cycleTheme kept for back-compat; setTheme added for the picker grid
//   * persist version bumped so old 'mint'|'candy' values migrate cleanly
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEME_IDS, DEFAULT_THEME, type ThemeId } from '@/lib/theme/themes';
import { ALL_AVATARS, DEFAULT_AVATAR, type AvatarId } from '@/lib/avatars/manifest';

interface ThemeState {
  theme: ThemeId;
  avatar: AvatarId;
  setTheme: (id: ThemeId) => void;
  cycleTheme: () => void;
  setAvatar: (id: AvatarId) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: DEFAULT_THEME,
      avatar: DEFAULT_AVATAR,
      setTheme: (theme) => set({ theme }),
      cycleTheme: () => {
        const i = THEME_IDS.indexOf(get().theme);
        set({ theme: THEME_IDS[(i + 1) % THEME_IDS.length] });
      },
      setAvatar: (avatar) => set({ avatar }),
    }),
    {
      name: 'lt_theme',
      version: 2,
      migrate: (state, version) => {
        const s = state as Partial<ThemeState>;
        if (version < 2) {
          // legacy 4-theme ids and component-based avatar ids no longer exist
          return {
            ...s,
            theme: THEME_IDS.includes(s.theme as ThemeId) ? s.theme : DEFAULT_THEME,
            avatar: ALL_AVATARS.includes(s.avatar as AvatarId) ? s.avatar : DEFAULT_AVATAR,
          } as ThemeState;
        }
        return s as ThemeState;
      },
    }
  )
);
