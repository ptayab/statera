// Statera registers no service worker. This file exists only to evict one:
// localhost is a shared origin, so a worker installed by any other project on
// this port keeps intercepting our navigations until something replaces it.
// The browser fetches /sw.js to check for updates, installs this script, and
// this script then unregisters itself.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
      await self.registration.unregister();

      const windows = await self.clients.matchAll({ type: "window" });
      for (const client of windows) {
        client.navigate(client.url);
      }
    })(),
  );
});
