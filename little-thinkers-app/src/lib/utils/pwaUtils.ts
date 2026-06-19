export type DisplayMode = 'standalone' | 'browser' | 'minimal-ui' | 'fullscreen';

export function getDisplayMode(): DisplayMode {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'browser';
  if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone';
  if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen';
  if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui';
  return 'browser';
}

export function isStandalone(): boolean {
  return getDisplayMode() === 'standalone';
}

export function isPwaCapable(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPwaCapable()) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    return reg;
  } catch {
    return null;
  }
}

export function getSafeAreaInsets(): { top: string; bottom: string; left: string; right: string } {
  if (typeof window === 'undefined') {
    return { top: '0px', bottom: '0px', left: '0px', right: '0px' };
  }
  const style = getComputedStyle(document.documentElement);
  return {
    top: style.getPropertyValue('env(safe-area-inset-top)') || '0px',
    bottom: style.getPropertyValue('env(safe-area-inset-bottom)') || '0px',
    left: style.getPropertyValue('env(safe-area-inset-left)') || '0px',
    right: style.getPropertyValue('env(safe-area-inset-right)') || '0px',
  };
}

export type OrientationType = 'portrait' | 'landscape';

export function getOrientation(): OrientationType {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'portrait';
  return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
}
