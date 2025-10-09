// SafeSource Consumer App Service Worker v3.0
const CACHE_NAME = 'safesource-consumer-v3.0';
const urlsToCache = [
  '/',
  '/apps/consumer/index.html',
  '/apps/consumer/manifest.json',
  '/packages/shared-network/network.js',
  '/packages/blockchain/blockchain.js',
  '/icons/consumer-192.png',
  '/icons/consumer-512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('✅ SafeSource Consumer: Service Worker Installed');
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
            console.log('🔄 SafeSource Consumer: Removing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Network synchronization for offline functionality
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  console.log('🔄 SafeSource Consumer: Background sync in progress...');
  // Sync verification data when back online
  return Promise.resolve();
}
