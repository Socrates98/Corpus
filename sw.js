const CACHE = 'corpus-v13';
const ASSETS = ['/', '/index.html', '/manifest.json', '/assets/icon-180.png', '/assets/icon-192.png', '/assets/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const isNav = e.request.mode === 'navigate';
  e.respondWith(
    fetch(e.request, isNav ? {cache:'no-cache'} : undefined).then(res => {
      if (!isNav) { const clone=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,clone)); }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
