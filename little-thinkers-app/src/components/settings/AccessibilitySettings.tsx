'use client';
import { useEffect } from 'react';
import { useAccessibilityStore } from '@/lib/stores/accessibilityStore';

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
    <div data-testid="settings-page" className="space-y-6">
      {/* Gameplay Mode */}
      <div data-testid="gameplay-mode-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
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
      </div>

      {/* Accessibility Toggles */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <p className="text-lg font-semibold text-gray-800 mb-4">Accessibility</p>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between min-h-[44px] mb-4">
          <span className="font-medium text-gray-800">Reduced Motion</span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.reducedMotion}
            aria-label="Reduced Motion"
            onClick={() => updateSetting(childId, 'reducedMotion', !settings.reducedMotion)}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 ${
              settings.reducedMotion ? 'bg-[var(--color-brand)]' : 'bg-gray-200'
            }`}
          >
            <span
              aria-hidden="true"
              className={`inline-block h-6 w-6 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Color-Blind Mode */}
        <div className="flex items-center justify-between min-h-[44px] mb-4">
          <span className="font-medium text-gray-800">Color-Blind Mode</span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.colorBlindMode}
            aria-label="Color-Blind Mode"
            onClick={() => updateSetting(childId, 'colorBlindMode', !settings.colorBlindMode)}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 ${
              settings.colorBlindMode ? 'bg-[var(--color-brand)]' : 'bg-gray-200'
            }`}
          >
            <span
              aria-hidden="true"
              className={`inline-block h-6 w-6 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                settings.colorBlindMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Dyslexia-Friendly Font */}
        <div className="flex items-center justify-between min-h-[44px]">
          <span className="font-medium text-gray-800">Dyslexia-Friendly Font</span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.dyslexiaFont}
            aria-label="Dyslexia-Friendly Font"
            onClick={() => updateSetting(childId, 'dyslexiaFont', !settings.dyslexiaFont)}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 ${
              settings.dyslexiaFont ? 'bg-[var(--color-brand)]' : 'bg-gray-200'
            }`}
          >
            <span
              aria-hidden="true"
              className={`inline-block h-6 w-6 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                settings.dyslexiaFont ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Text Size */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
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
      </div>

      {/* One-Handed Layout */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
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
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={() => resetSettings(childId)}
        className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-gray-400 transition-colors min-h-[44px]"
      >
        Reset to Defaults
      </button>
    </div>
  );
}
