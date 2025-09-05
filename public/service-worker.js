self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('transMiApp-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/placeholder-logo.png',
        '/placeholder-user.jpg',
        '/placeholder.jpg',
        '/placeholder.svg',
        '/globals.css',
        // Agrega aquí más rutas si es necesario
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== 'transMiApp-v1').map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
