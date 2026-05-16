import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

// Vitest 4 breaks jsdom localStorage — stub a manual implementation.
const _store: Record<string, string> = {};
const _localStorage = {
  getItem: (key: string) => _store[key] ?? null,
  setItem: (key: string, value: string) => { _store[key] = value; },
  removeItem: (key: string) => { delete _store[key]; },
  clear: () => { Object.keys(_store).forEach((k) => delete _store[k]); },
  get length() { return Object.keys(_store).length; },
  key: (n: number) => Object.keys(_store)[n] ?? null,
};

beforeAll(() => {
  vi.stubGlobal('localStorage', _localStorage);
});

import { useAccessibilityStore } from '@/lib/stores/accessibilityStore';
import {
  DEFAULT_ACCESSIBILITY_SETTINGS,
  type AccessibilitySettings,
} from '@/lib/types/accessibility';

const CHILD_ID = 'child-1';
const storageKey = `lt_accessibility_${CHILD_ID}`;

beforeEach(() => {
  _localStorage.clear();
  useAccessibilityStore.setState({
    settings: { ...DEFAULT_ACCESSIBILITY_SETTINGS },
    childId: null,
  });
});

describe('accessibilityStore', () => {
  describe('hydrateSettings (AC1, AC7)', () => {
    it('loads settings from localStorage when data exists', () => {
      const saved: AccessibilitySettings = {
        gameplayMode: 'chill',
        reducedMotion: true,
        colorBlindMode: true,
        dyslexiaFont: true,
        textSize: 'large',
        handedLayout: 'left',
      };
      _localStorage.setItem(storageKey, JSON.stringify(saved));
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      const { settings } = useAccessibilityStore.getState();
      expect(settings.gameplayMode).toBe('chill');
      expect(settings.reducedMotion).toBe(true);
      expect(settings.colorBlindMode).toBe(true);
      expect(settings.dyslexiaFont).toBe(true);
      expect(settings.textSize).toBe('large');
      expect(settings.handedLayout).toBe('left');
    });

    it('uses DEFAULT_ACCESSIBILITY_SETTINGS when no localStorage data', () => {
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      expect(useAccessibilityStore.getState().settings).toEqual(
        DEFAULT_ACCESSIBILITY_SETTINGS,
      );
    });

    it('sets childId on the store', () => {
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      expect(useAccessibilityStore.getState().childId).toBe(CHILD_ID);
    });

    it('merges defaults first then stored values so new fields have defaults', () => {
      // Stored data is missing newer fields (textSize, handedLayout)
      const partial = {
        gameplayMode: 'focus',
        reducedMotion: true,
      };
      _localStorage.setItem(storageKey, JSON.stringify(partial));
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      const { settings } = useAccessibilityStore.getState();
      // Stored values win
      expect(settings.gameplayMode).toBe('focus');
      expect(settings.reducedMotion).toBe(true);
      // Missing fields fall back to defaults
      expect(settings.textSize).toBe(DEFAULT_ACCESSIBILITY_SETTINGS.textSize);
      expect(settings.handedLayout).toBe(
        DEFAULT_ACCESSIBILITY_SETTINGS.handedLayout,
      );
      expect(settings.colorBlindMode).toBe(
        DEFAULT_ACCESSIBILITY_SETTINGS.colorBlindMode,
      );
    });

    it('hydrates settings scoped per child id', () => {
      _localStorage.setItem(
        'lt_accessibility_child-2',
        JSON.stringify({ ...DEFAULT_ACCESSIBILITY_SETTINGS, textSize: 'small' }),
      );
      useAccessibilityStore.getState().hydrateSettings('child-2');
      expect(useAccessibilityStore.getState().settings.textSize).toBe('small');
      expect(useAccessibilityStore.getState().childId).toBe('child-2');
    });
  });

  describe('updateSetting — boolean settings (AC2, AC3, AC4)', () => {
    it('updates reducedMotion', () => {
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      useAccessibilityStore
        .getState()
        .updateSetting(CHILD_ID, 'reducedMotion', true);
      expect(useAccessibilityStore.getState().settings.reducedMotion).toBe(true);
    });

    it('updates colorBlindMode', () => {
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      useAccessibilityStore
        .getState()
        .updateSetting(CHILD_ID, 'colorBlindMode', true);
      expect(useAccessibilityStore.getState().settings.colorBlindMode).toBe(
        true,
      );
    });

    it('updates dyslexiaFont', () => {
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      useAccessibilityStore
        .getState()
        .updateSetting(CHILD_ID, 'dyslexiaFont', true);
      expect(useAccessibilityStore.getState().settings.dyslexiaFont).toBe(true);
    });
  });

  describe('updateSetting — enum settings (AC1, AC5, AC6)', () => {
    it('updates gameplayMode', () => {
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      useAccessibilityStore
        .getState()
        .updateSetting(CHILD_ID, 'gameplayMode', 'focus');
      expect(useAccessibilityStore.getState().settings.gameplayMode).toBe(
        'focus',
      );
    });

    it('updates textSize', () => {
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      useAccessibilityStore
        .getState()
        .updateSetting(CHILD_ID, 'textSize', 'large');
      expect(useAccessibilityStore.getState().settings.textSize).toBe('large');
    });

    it('updates handedLayout', () => {
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      useAccessibilityStore
        .getState()
        .updateSetting(CHILD_ID, 'handedLayout', 'right');
      expect(useAccessibilityStore.getState().settings.handedLayout).toBe(
        'right',
      );
    });

    it('does NOT mutate unrelated settings', () => {
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      useAccessibilityStore
        .getState()
        .updateSetting(CHILD_ID, 'gameplayMode', 'chill');
      const { settings } = useAccessibilityStore.getState();
      expect(settings.gameplayMode).toBe('chill');
      expect(settings.reducedMotion).toBe(
        DEFAULT_ACCESSIBILITY_SETTINGS.reducedMotion,
      );
      expect(settings.colorBlindMode).toBe(
        DEFAULT_ACCESSIBILITY_SETTINGS.colorBlindMode,
      );
      expect(settings.textSize).toBe(DEFAULT_ACCESSIBILITY_SETTINGS.textSize);
      expect(settings.handedLayout).toBe(
        DEFAULT_ACCESSIBILITY_SETTINGS.handedLayout,
      );
    });
  });

  describe('updateSetting — persistence (AC7)', () => {
    it('persists updated setting to localStorage', () => {
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      useAccessibilityStore
        .getState()
        .updateSetting(CHILD_ID, 'reducedMotion', true);
      const raw = _localStorage.getItem(storageKey);
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!) as AccessibilitySettings;
      expect(parsed.reducedMotion).toBe(true);
    });

    it('persists the full settings object as JSON', () => {
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      useAccessibilityStore
        .getState()
        .updateSetting(CHILD_ID, 'textSize', 'large');
      const parsed = JSON.parse(
        _localStorage.getItem(storageKey)!,
      ) as AccessibilitySettings;
      expect(parsed).toEqual({
        ...DEFAULT_ACCESSIBILITY_SETTINGS,
        textSize: 'large',
      });
    });

    it('uses the lt_accessibility_<childId> localStorage key', () => {
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      useAccessibilityStore
        .getState()
        .updateSetting(CHILD_ID, 'dyslexiaFont', true);
      expect(_localStorage.getItem(`lt_accessibility_${CHILD_ID}`)).not.toBeNull();
    });

    it('accumulates multiple sequential updates in localStorage', () => {
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      useAccessibilityStore
        .getState()
        .updateSetting(CHILD_ID, 'reducedMotion', true);
      useAccessibilityStore
        .getState()
        .updateSetting(CHILD_ID, 'gameplayMode', 'focus');
      const parsed = JSON.parse(
        _localStorage.getItem(storageKey)!,
      ) as AccessibilitySettings;
      expect(parsed.reducedMotion).toBe(true);
      expect(parsed.gameplayMode).toBe('focus');
    });
  });

  describe('resetSettings (AC7)', () => {
    it('restores DEFAULT_ACCESSIBILITY_SETTINGS', () => {
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      useAccessibilityStore
        .getState()
        .updateSetting(CHILD_ID, 'gameplayMode', 'chill');
      useAccessibilityStore.getState().resetSettings(CHILD_ID);
      expect(useAccessibilityStore.getState().settings).toEqual(
        DEFAULT_ACCESSIBILITY_SETTINGS,
      );
    });

    it('removes the localStorage key', () => {
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      useAccessibilityStore
        .getState()
        .updateSetting(CHILD_ID, 'reducedMotion', true);
      expect(_localStorage.getItem(storageKey)).not.toBeNull();
      useAccessibilityStore.getState().resetSettings(CHILD_ID);
      expect(_localStorage.getItem(storageKey)).toBeNull();
    });

    it('sets childId on the store', () => {
      useAccessibilityStore.getState().resetSettings(CHILD_ID);
      expect(useAccessibilityStore.getState().childId).toBe(CHILD_ID);
    });
  });

  describe('localStorage persistence shape (AC7)', () => {
    it('stores value as JSON of an AccessibilitySettings object', () => {
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      useAccessibilityStore
        .getState()
        .updateSetting(CHILD_ID, 'handedLayout', 'left');
      const raw = _localStorage.getItem(storageKey)!;
      const parsed = JSON.parse(raw) as AccessibilitySettings;
      expect(parsed).toHaveProperty('gameplayMode');
      expect(parsed).toHaveProperty('reducedMotion');
      expect(parsed).toHaveProperty('colorBlindMode');
      expect(parsed).toHaveProperty('dyslexiaFont');
      expect(parsed).toHaveProperty('textSize');
      expect(parsed).toHaveProperty('handedLayout');
    });

    it('survives a hydrate -> update -> re-hydrate round trip', () => {
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      useAccessibilityStore
        .getState()
        .updateSetting(CHILD_ID, 'colorBlindMode', true);
      // Simulate a new session: reset store state, then re-hydrate
      useAccessibilityStore.setState({
        settings: { ...DEFAULT_ACCESSIBILITY_SETTINGS },
        childId: null,
      });
      useAccessibilityStore.getState().hydrateSettings(CHILD_ID);
      expect(useAccessibilityStore.getState().settings.colorBlindMode).toBe(
        true,
      );
    });
  });
});
