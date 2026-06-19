import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeId = 'mint' | 'sunshine' | 'candy' | 'lavender';
export type AvatarId = 'bird' | 'bear' | 'ghost' | 'chick' | 'unicorn' | 'gnome' | 'monkey' | 'bat' | 'fish' | 'knight' | 'alien' | 'witch' | 'walrus' | 'elf';

const THEME_ORDER: ThemeId[] = ['mint', 'sunshine', 'candy', 'lavender'];

interface ThemeState {
  theme: ThemeId;
  avatar: AvatarId;
  cycleTheme: () => void;
  setAvatar: (id: AvatarId) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'sunshine',
      avatar: 'bird',
      cycleTheme: () => {
        const idx = THEME_ORDER.indexOf(get().theme);
        set({ theme: THEME_ORDER[(idx + 1) % THEME_ORDER.length] });
      },
      setAvatar: (avatar) => set({ avatar }),
    }),
    { name: 'lt_theme' }
  )
);
