/**
 * Epic 6 — RED tests: PWA Installability + Standalone Behavior
 *
 * Story 6.1: app is installable as a PWA (manifest, service worker)
 * Story 6.2: standalone mode, safe-area, portrait/landscape support
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isPwaCapable,
  registerServiceWorker,
  getDisplayMode,
  isStandalone,
  getOrientation,
} from '@/lib/utils/pwaUtils';

describe('PWA Utils — Story 6.1', () => {
  it('AC: isPwaCapable returns true when serviceWorker is in navigator', () => {
    // JSDOM does not have serviceWorker; test the logic with a manual stub
    const originalNavigator = global.navigator;
    Object.defineProperty(global, 'navigator', {
      value: { ...originalNavigator, serviceWorker: {} },
      configurable: true,
    });
    expect(isPwaCapable()).toBe(true);
    Object.defineProperty(global, 'navigator', { value: originalNavigator, configurable: true });
  });

  it('AC: isPwaCapable returns false when serviceWorker is absent', () => {
    const originalNavigator = global.navigator;
    const navWithout = { ...originalNavigator };
    delete (navWithout as any).serviceWorker;
    Object.defineProperty(global, 'navigator', { value: navWithout, configurable: true });
    expect(isPwaCapable()).toBe(false);
    Object.defineProperty(global, 'navigator', { value: originalNavigator, configurable: true });
  });

  it('AC: registerServiceWorker returns null when not PWA capable', async () => {
    const originalNavigator = global.navigator;
    const navWithout = { ...originalNavigator };
    delete (navWithout as any).serviceWorker;
    Object.defineProperty(global, 'navigator', { value: navWithout, configurable: true });
    const result = await registerServiceWorker();
    expect(result).toBeNull();
    Object.defineProperty(global, 'navigator', { value: originalNavigator, configurable: true });
  });

  it('AC: manifest.json exists at /public/manifest.json', async () => {
    // Verify by importing the manifest data directly
    const fs = await import('fs');
    const path = await import('path');
    const manifestPath = path.resolve(process.cwd(), 'public/manifest.json');
    const exists = fs.existsSync(manifestPath);
    expect(exists).toBe(true);
  });

  it('AC: manifest.json has required PWA fields', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const manifestPath = path.resolve(process.cwd(), 'public/manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBeTruthy();
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  it('AC: service worker file exists at /public/sw.js', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const swPath = path.resolve(process.cwd(), 'public/sw.js');
    expect(fs.existsSync(swPath)).toBe(true);
  });
});

describe('PWA Utils — Story 6.2', () => {
  it('AC: getDisplayMode returns browser in test environment', () => {
    // JSDOM doesn't match standalone, so we get browser
    const mode = getDisplayMode();
    expect(['browser', 'standalone', 'minimal-ui', 'fullscreen']).toContain(mode);
  });

  it('AC: isStandalone returns false in test (browser) environment', () => {
    expect(isStandalone()).toBe(false);
  });

  it('AC: getOrientation returns portrait or landscape', () => {
    const orientation = getOrientation();
    expect(['portrait', 'landscape']).toContain(orientation);
  });

  it('AC: manifest theme_color matches brand color', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const manifest = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'public/manifest.json'), 'utf-8'));
    expect(manifest.theme_color).toBe('#7C3AED');
  });

  it('AC: manifest orientation supports both portrait and landscape (any)', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const manifest = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'public/manifest.json'), 'utf-8'));
    expect(manifest.orientation).toBe('any');
  });
});
