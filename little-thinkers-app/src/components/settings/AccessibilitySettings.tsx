'use client';
import { useEffect } from 'react';
import { useAccessibilityStore } from '@/lib/stores/accessibilityStore';
import { DEFAULT_ACCESSIBILITY_SETTINGS } from '@/lib/types/accessibility';
import type { AccessibilitySettings as AccessibilitySettingsType } from '@/lib/types/accessibility';

export function AccessibilitySettings({ childId }: { childId: string }) {
  const { settings, hydrateSettings, updateSetting, resetSettings } = useAccessibilityStore();

  useEffect(() => {
    if (childId) hydrateSettings(childId);
  }, [childId, hydrateSettings]);

  // Apply document-level classes for dyslexiaFont, colorBlindMode, reducedMotion.
  // Clean up on unmount so stale attributes/classes don't leak onto the global
  // <html> element after the user leaves the settings page.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dyslexia-font', settings.dyslexiaFont);
    root.setAttribute('data-color-blind', settings.colorBlindMode ? 'true' : 'false');
    root.setAttribute('data-reduced-motion', settings.reducedMotion ? 'true' : 'false');
    root.setAttribute('data-text-size', settings.textSize);
    root.setAttribute('data-handed-layout', settings.handedLayout);
    return () => {
      root.classList.remove('dyslexia-font');
      root.removeAttribute('data-color-blind');
      root.removeAttribute('data-reduced-motion');
      root.removeAttribute('data-text-size');
      root.removeAttribute('data-handed-layout');
    };
  }, [settings]);

  return (
    <div className="space-y-8">
      {/* Gameplay Mode */}
      <fieldset>
        <legend className="text-lg font-semibold text-gray-800 mb-3">Gameplay Mode</legend>
        <div className="flex flex-col gap-3">
          {(['smart', 'chill', 'focus'] as const).map((mode) => (
            <label key={mode} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
              <input
                type="radio"
                name="gameplayMode"
                value={mode}
                checked={settings.gameplayMode === mode}
                onChange={() => updateSetting(childId, 'gameplayMode', mode)}
                className="w-5 h-5"
              />
              <span className="capitalize font-medium">{mode}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Reduced Motion */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => updateSetting(childId, 'reducedMotion', e.target.checked)}
            className="w-5 h-5"
          />
          <span className="font-medium text-gray-800">Reduced Motion</span>
        </label>
      </div>

      {/* Color-Blind Mode */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
          <input
            type="checkbox"
            checked={settings.colorBlindMode}
            onChange={(e) => updateSetting(childId, 'colorBlindMode', e.target.checked)}
            className="w-5 h-5"
          />
          <span className="font-medium text-gray-800">Color-Blind Mode</span>
        </label>
      </div>

      {/* Dyslexia-Friendly Font */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
          <input
            type="checkbox"
            checked={settings.dyslexiaFont}
            onChange={(e) => updateSetting(childId, 'dyslexiaFont', e.target.checked)}
            className="w-5 h-5"
          />
          <span className="font-medium text-gray-800">Dyslexia-Friendly Font</span>
        </label>
      </div>

      {/* Text Size */}
      <fieldset>
        <legend className="text-lg font-semibold text-gray-800 mb-3">Text Size</legend>
        <div className="flex flex-col gap-3">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <label key={size} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
              <input
                type="radio"
                name="textSize"
                value={size}
                checked={settings.textSize === size}
                onChange={() => updateSetting(childId, 'textSize', size)}
                className="w-5 h-5"
              />
              <span className="capitalize font-medium">{size}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* One-Handed Layout */}
      <fieldset>
        <legend className="text-lg font-semibold text-gray-800 mb-3">One-Handed Layout</legend>
        <div className="flex flex-col gap-3">
          {(['default', 'left', 'right'] as const).map((layout) => (
            <label key={layout} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
              <input
                type="radio"
                name="handedLayout"
                value={layout}
                checked={settings.handedLayout === layout}
                onChange={() => updateSetting(childId, 'handedLayout', layout)}
                className="w-5 h-5"
              />
              <span className="capitalize font-medium">{layout}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Reset */}
      <button
        onClick={() => resetSettings(childId)}
        className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-gray-400 transition-colors min-h-[44px]"
      >
        Reset to Defaults
      </button>
    </div>
  );
}
