// DigiWorku Service Worker — Cache & Offline Resilience
const CACHE_NAME = 'digiworku-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.jpg',
  '/favicon.png',
  '/apple-touch-icon.png'
];

// Install event: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Pre-caching non-fatal issue:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate event: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Network-first for APIs/dynamic; Stale-while-revalidate for assets
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip non-GET requests or requests to APIs / WebSockets / Supabase backend
  if (
    event.request.method !== 'GET' ||
    requestUrl.pathname.startsWith('/api/') ||
    requestUrl.hostname.includes('supabase.co') ||
    requestUrl.hostname.includes('googleapis.com')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fails and no cached asset, fallback to cached index.html for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});
