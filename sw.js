// SafeSource Consumer Service Worker v3.0
const CACHE_NAME = 'safesource-consumer-v3';
const STATIC_ASSETS = [
  '/consumer/',
  '/manifest.json',
  '/shared/network.js',
  '/shared/blockchain.js',
  '/icons/consumer-192.png',
  '/icons/consumer-512.png'
];

// Install - Cache critical assets
self.addEventListener('install', (event) => {
  console.log('🛠️ SafeSource Consumer SW installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate - Cleanup old caches  
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Network first, cache fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Background Sync for offline reports
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reports') {
    event.waitUntil(syncPendingReports());
  }
});

// Sync pending SARS reports when online
async function syncPendingReports() {
  const pendingReports = JSON.parse(localStorage.getItem('pending-sars-reports')) || [];
  
  for (const report of pendingReports) {
    try {
      await submitSARSReport(report);
      // Remove successfully synced report
      pendingReports.splice(pendingReports.indexOf(report), 1);
    } catch (error) {
      console.error('Failed to sync report:', error);
    }
  }
  
  localStorage.setItem('pending-sars-reports', JSON.stringify(pendingReports));
}

// Simulate SARS report submission
async function submitSARSReport(report) {
  // In production, this would be a real API call
  console.log('📧 Submitting SARS report:', report);
  
  // Mock email template for illicittrade@sars.gov.za
  const emailTemplate = {
    to: 'illicittrade@sars.gov.za',
    subject: `SafeSource Counterfeit Report - ${report.productType} - ${report.store}`,
    body: `
Product: ${report.brand} ${report.productType}
Store: ${report.store} (GPS: ${report.gps})
Estimated Value: R${report.value}
Date: ${report.timestamp}
Description: ${report.description}

This report was generated automatically via SafeSource verification platform.
GPS coordinates and timestamps are blockchain-verified.
    `
  };
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('✅ SARS report submitted via email');
      resolve(true);
    }, 1000);
  });
}

console.log('🎯 SafeSource Consumer Service Worker activated');