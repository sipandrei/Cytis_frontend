const CACHE_VERSION = "v1";
const CACHE_NAME = CACHE_VERSION + ":sw-cache-cytis";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(function prefill(cache) {}));
});

self.addEventListener("fetch", (event) => {
  console.log(event);
});
