// Service Worker for improved caching and performance
const CACHE_NAME = "simple-mvp-cache-v1";

// Assets to precache
const PRECACHE_ASSETS = [
  "/",
  "/offline",
  "/favicon.ico",
  "/icon.png",
  "/apple-icon.png",
];

// Installation - precache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME;
            })
            .map((cacheName) => {
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Network-first strategy for HTML routes
async function networkFirstStrategy(request) {
  try {
    // Try to get from network first
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);

    // Clone the response before putting it in cache
    // because the response body can only be consumed once
    cache.put(request, networkResponse.clone());

    return networkResponse;
  } catch (error) {
    // If network fails, try to get from cache
    const cachedResponse = await caches.match(request);
    return cachedResponse || caches.match("/offline");
  }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    return new Response("Not found", { status: 404 });
  }
}

// Fetch event handler
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Don't cache API calls
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Determine the caching strategy based on the request type
  if (request.method !== "GET") {
    return;
  }

  // For static assets, use cache-first strategy
  const isStaticAsset =
    /\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|otf)$/i.test(
      url.pathname
    );

  if (isStaticAsset) {
    event.respondWith(cacheFirstStrategy(request));
  } else {
    // For HTML pages, use network-first strategy
    event.respondWith(networkFirstStrategy(request));
  }
});

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncData());
  }
});

// Handle service worker messages
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
