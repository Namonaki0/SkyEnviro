self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("staticApp").then((cache) => {
      return cache.addAll(["./", "./styles.css", "./images/skyenviro.png"]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
