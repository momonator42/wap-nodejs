// plugins/workbox-cache.js
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// Offline-Seite bei Netzwerkfehlern bereitstellen
workbox.routing.setCatchHandler(({ event }) => {
  // Bei einem Navigationsanfrage-Fehler (z.B. im Offline-Modus)
  if (event.request.mode === 'navigate') {
    return caches.match('/offline.html');
  }

  return Response.error();
});
