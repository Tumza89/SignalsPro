// SignalsPro service worker.
// Change VERSION on every release: it makes phones drop the old files and pick up the new ones.
const VERSION = '2026.11.24.5';
const CACHE = 'signalspro-' + VERSION;
const CORE = ['./', 'index.html', 'manifest.json', 'icon-192.png'];

self.addEventListener('install', e => {
  // cache the basics, but never fail the install because one file is missing
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(CORE.map(u => c.add(new Request(u, { cache: 'reload' }))))));
  self.skipWaiting();                                   // do not wait for every tab to close
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))   // delete old versions
      .then(() => self.clients.claim())                 // take over the open pages straight away
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== self.location.origin) return;        // data feeds and fonts are never cached here
  const isPage = r.mode === 'navigate' || u.pathname === '/' || u.pathname.endsWith('/index.html') || u.pathname.endsWith('/');
  if (isPage) {
    // the app itself: always try the network first so the newest version wins, use the saved copy only when offline
    e.respondWith(
      fetch(r, { cache: 'no-store' }).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); }
        return res;
      }).catch(() => caches.match('index.html').then(m => m || caches.match('./')))
    );
    return;
  }
  // icons and other small files: saved copy first, then the network
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => {
    if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); }
    return res;
  })));
});

// tapping a notification opens or focuses the app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) if ('focus' in c) return c.focus();
    return self.clients.openWindow('./');
  }));
});
