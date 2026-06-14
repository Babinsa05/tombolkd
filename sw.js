// Service Worker for Udayana Portal
const CACHE_NAME = 'udayana-portal-v3';
const APK_URL = 'https://example.com/udayana-portal.apk'; // Ganti dengan URL APK Anda

// Assets to cache
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  'https://upload.wikimedia.org/wikipedia/commons/2/25/Lambang_Kodam_Udayana.svg',
  'https://babinsa05.github.io/tombol2/apple-touch-icon.png',
  'https://babinsa05.github.io/tombol2/favicon-32x32.png',
  'https://babinsa05.github.io/tombol2/favicon-16x16.png'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Handle APK download
  if (event.request.url.includes('udayana-portal.apk')) {
    event.respondWith(
      fetch(APK_URL).catch(() => {
        return new Response('APK not available', {
          status: 404,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
    );
    return;
  }
  
  // Network first strategy
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            
            // Return offline page for HTML
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('./');
            }
            
            // Return fallback image
            if (event.request.destination === 'image') {
              return caches.match('https://upload.wikimedia.org/wikipedia/commons/2/25/Lambang_Kodam_Udayana.svg');
            }
            
            return new Response('Udayana Portal - Mode Offline', {
              status: 200,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Message handler
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  if (event.data === 'clearCache') {
    caches.keys().then(names => names.forEach(name => caches.delete(name)));
  }
});

// Background sync for APK download
self.addEventListener('sync', (event) => {
  if (event.tag === 'download-apk') {
    console.log('[SW] Background syncing APK download');
    event.waitUntil(downloadAPK());
  }
});

async function downloadAPK() {
  try {
    const response = await fetch(APK_URL);
    const cache = await caches.open('apk-cache');
    await cache.put(APK_URL, response.clone());
    console.log('[SW] APK cached for offline');
  } catch (error) {
    console.error('[SW] Failed to cache APK:', error);
  }
}
