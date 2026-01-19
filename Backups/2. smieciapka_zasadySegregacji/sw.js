const CACHE_NAME = 'waste-schedule-v3';
const ASSETS = [
    '/',
    '/index.html',
    '/settings.html',
    '/manifest.json',
    '/assets/favicon.png',
    '/assets/icon-192x192.png',
    '/assets/icon-512x512.png',
    '/assets/zmieszane.png',
    '/assets/sztuczne.png',
    '/assets/papier.png',
    '/assets/szklo.png',
    '/assets/bio.png',
    '/assets/gabaryty.png',
    '/assets/choinki.png',
    '/assets/brak.png'
];

// On install, cache all static resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting()) // Activate worker immediately
    );
});

// On fetch, try network first, then cache
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Clone the response before using it
                const responseClone = response.clone();

                // Open cache and update it with new response
                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseClone);
                    });

                return response;
            })
            .catch(() => {
                // If network fails, try cache
                return caches.match(event.request);
            })
    );
});

// Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            // Take control of all clients immediately
            self.clients.claim(),

            // Remove old caches
            caches.keys().then(keys => {
                return Promise.all(
                    keys.filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                );
            })
        ])
    );
});
