// service-worker.js

const CACHE_NAME = "skater-mtrue-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/crimes.html",
  "/coloniality.html",
  "/Bop.html",
  "/fill-in-the-poem.html",
  "/01.mov",
  // Add all image/icon/audio/video files you want cached here
];

// Install and cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve files from cache if available
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Update cache if new versions exist
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      )
    )
  );
});
