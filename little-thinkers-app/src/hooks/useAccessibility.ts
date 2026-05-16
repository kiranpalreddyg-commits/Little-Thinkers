'use client';
import { useAccessibilityStore } from '@/lib/stores/accessibilityStore';

export function useAccessibility() {
  const store = useAccessibilityStore();
  return {
    settings: store.settings,
    childId: store.childId,
    hydrateSettings: store.hydrateSettings,
    updateSetting: store.updateSetting,
    resetSettings: store.resetSettings,
  };
}
