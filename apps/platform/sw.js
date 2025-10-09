// SafeSource Platform Service Worker v3.0
const CACHE_NAME = 'safesource-platform-v3.0';
const urlsToCache = [
  '/',
  '/apps/platform/index.html',
  '/apps/platform/manifest.json',
  '/packages/shared-network/network.js',
  '/packages/blockchain/blockchain.js',
  '/icons/platform-192.png',
  '/icons/platform-512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('🏢 SafeSource Platform: Service Worker Installed');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🔄 SafeSource Platform: Removing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Advanced caching for real-time data
self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Background sync for intelligence data
self.addEventListener('sync', function(event) {
  if (event.tag === 'intelligence-sync') {
    event.waitUntil(syncIntelligenceData());
  }
});

function syncIntelligenceData() {
  console.log('🔄 SafeSource Platform: Syncing intelligence data...');
  // Sync SARS reports and verification data
  return fetch('/api/sync')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log('✅ Intelligence data synced:', data);
      return data;
    });
}
