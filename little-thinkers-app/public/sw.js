const CACHE_NAME = 'little-thinkers-c6-0gNdPZJNBM2AmIRTjs';
const SHELL_CACHE = 'little-thinkers-shell-c6-0gNdPZJNBM2AmIRTjs';

// App shell — always precached
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
];

// /_next/static/ chunks use content-hashed filenames — cache-first, long TTL
const isStaticChunk = (url) =>
  url.pathname.startsWith('/_next/static/');

// HTML navigations — network-first with shell fallback
const isNavigation = (request) =>
  request.mode === 'navigate';

// API routes — network-only, never cache
const isApi = (url) =>
  url.pathname.startsWith('/api/');

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== SHELL_CACHE)
          .map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // API calls: always go to network
  if (isApi(url)) return;

  // Next.js static chunks: cache-first (filenames are content-hashed)
  if (isStaticChunk(url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        if (response.ok) cache.put(event.request, response.clone());
        return response;
      }),
    );
    return;
  }

  // HTML navigations: network-first, fall back to shell
  if (isNavigation(event.request)) {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/').then((shell) => shell || new Response('Offline', { status: 503 })),
      ),
    );
    return;
  }

  // Everything else: stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      const fetchPromise = fetch(event.request).then((response) => {
        if (response.ok) cache.put(event.request, response.clone());
        return response;
      });
      return cached || fetchPromise;
    }),
  );
});
