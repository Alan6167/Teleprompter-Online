/*
 * Offline support for Teleprompter Online.
 *
 * The prompter itself is pure client-side JavaScript, so once the page and its chunks are
 * cached there is nothing a reader needs the network for — scripts and settings already
 * live in localStorage. That makes a plain runtime cache enough; no build-time precache
 * manifest to keep in sync with Next's hashed filenames.
 */

const VERSION = 'v1';
const STATIC_CACHE = `tpo-static-${VERSION}`;
const PAGE_CACHE = `tpo-pages-${VERSION}`;

self.addEventListener('install', (event) => {
  // The prompter lives at the root, so that one document is worth having up front:
  // it is the page a reader is most likely to open cold with no connection.
  event.waitUntil(
    caches
      .open(PAGE_CACHE)
      .then((cache) => cache.add('/'))
      .catch(() => undefined)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('tpo-') && ![STATIC_CACHE, PAGE_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

/** Hashed build assets never change under a given URL, so cache-first is safe and fast. */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response && response.ok) cache.put(request, response.clone());
  return response;
}

/**
 * Pages go network-first: a reader online should always get the current copy, and the
 * cached one only stands in when the network is unavailable.
 */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    const hit = await cache.match(request);
    if (hit) return hit;
    const root = await cache.match('/');
    if (root) return root;
    throw error;
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // analytics and fonts stay untouched

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, PAGE_CACHE));
    return;
  }

  if (url.pathname.startsWith('/_next/static/') || /\.(css|js|woff2?|png|svg|ico)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  }
});
