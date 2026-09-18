// Deliberately minimal. Goals, in priority order:
// 1. Never interfere with anything dynamic or sensitive — /api/*, /admin/*,
//    /portal/* are never intercepted, so leads, auth, and dashboards always
//    hit the network fresh. Non-GET requests are never intercepted either.
// 2. Give the PWA manifest (already in public/manifest.json) something
//    real behind it — an offline fallback — without pretending to be a
//    full offline-first app.
// 3. Static, content-hashed build assets (_next/static/...) are safe to
//    cache aggressively since a new deploy ships new hashed filenames.

const CACHE_NAME = "nx-cache-v1";
const OFFLINE_URL = "/offline.html";

const NEVER_CACHE_PREFIXES = ["/api/", "/admin", "/portal"];

function shouldBypass(url) {
  return NEVER_CACHE_PREFIXES.some((prefix) => url.pathname.startsWith(prefix));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (shouldBypass(url)) return;

  // Page navigations: always try the network first (so content is never
  // stale), fall back to a cached copy, then the offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL)))
    );
    return;
  }

  // Everything else same-origin (hashed JS/CSS chunks, fonts, images):
  // cache-first, refresh in the background.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
