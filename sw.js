// Minimal service worker — enables PWA install without aggressive caching
// Changes to index.html show up immediately on reload
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
