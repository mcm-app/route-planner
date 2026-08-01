const CACHE_NAME = 'route-planner-v1';
const ASSETS = [
  './',
  './index.html',
  'https://unpkg.com/maplibre-gl@4.5.0/dist/maplibre-gl.css',
  'https://unpkg.com/maplibre-gl@4.5.0/dist/maplibre-gl.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first for API calls, cache first for assets
  const url = new URL(e.request.url);
  if (url.hostname === 'nominatim.openstreetmap.org' ||
      url.hostname === 'router.project-osrm.org' ||
      url.hostname === 'overpass-api.de' ||
      url.hostname.includes('basemaps.cartocdn.com')) {
    // Network only for live data and map tiles
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
