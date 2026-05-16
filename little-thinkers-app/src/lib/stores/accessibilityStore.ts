import { create } from 'zustand';
import type { AccessibilitySettings } from '@/lib/types/accessibility';
import { DEFAULT_ACCESSIBILITY_SETTINGS } from '@/lib/types/accessibility';

const storageKey = (childId: string) => `lt_accessibility_${childId}`;

interface AccessibilityState {
  settings: AccessibilitySettings;
  childId: string | null;

  hydrateSettings: (childId: string) => void;
  updateSetting: <K extends keyof AccessibilitySettings>(
    childId: string,
    key: K,
    value: AccessibilitySettings[K],
  ) => void;
  resetSettings: (childId: string) => void;
}

export const useAccessibilityStore = create<AccessibilityState>((set, get) => ({
  settings: { ...DEFAULT_ACCESSIBILITY_SETTINGS },
  childId: null,

  hydrateSettings: (childId: string) => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(storageKey(childId));
      const stored = raw ? (JSON.parse(raw) as Partial<AccessibilitySettings>) : {};
      // Spread defaults first so new fields always have defaults
      const settings: AccessibilitySettings = { ...DEFAULT_ACCESSIBILITY_SETTINGS, ...stored };
      set({ settings, childId });
    } catch {
      set({ settings: { ...DEFAULT_ACCESSIBILITY_SETTINGS }, childId });
    }
  },

  updateSetting: <K extends keyof AccessibilitySettings>(
    childId: string,
    key: K,
    value: AccessibilitySettings[K],
  ) => {
    if (typeof window === 'undefined') return;
    const current = get().settings;
    const newSettings: AccessibilitySettings = { ...current, [key]: value };
    try {
      localStorage.setItem(storageKey(childId), JSON.stringify(newSettings));
    } catch {
      // Safari private mode — continue without persistence
    }
    set({ settings: newSettings });
  },

  resetSettings: (childId: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(storageKey(childId));
    } catch {
      // ignore
    }
    set({ settings: { ...DEFAULT_ACCESSIBILITY_SETTINGS }, childId });
  },
}));
