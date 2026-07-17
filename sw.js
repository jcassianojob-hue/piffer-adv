const VER = 'spc-v1';
const CORE = [
  '/', '/index.html', '/sobre.html', '/areas-de-atuacao.html',
  '/direito-do-trabalho.html', '/direito-previdenciario.html',
  '/contato.html', '/blog.html', '/manifest.json',
  '/assets/css/fonts.css',
  '/assets/fonts/work-sans-latin-400-normal.woff2',
  '/assets/fonts/work-sans-latin-500-normal.woff2',
  '/assets/fonts/work-sans-latin-600-normal.woff2',
  '/assets/fonts/ibm-plex-serif-latin-400-normal.woff2',
  '/assets/fonts/ibm-plex-serif-latin-700-normal.woff2',
  '/assets/img/favicon.svg',
  '/assets/img/icon-192.png',
  '/assets/img/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VER).then(c => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== VER).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const {request} = e;
  if (request.method !== 'GET') return;
  if (request.url.includes('googletagmanager') || request.url.includes('google-analytics')) return;
  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(VER).then(c => c.put(request, clone));
        return res;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
