// Keep this service worker minimal while SignalsPro's landing page and app are hosted together.
// The current app relies on registration of this file; this version does not intercept or cache requests.
self.addEventListener('install', event => {
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
