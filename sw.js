const CACHE_NAME = 'abc123-v5';

// Listan över inspelade röstljud (VOICE_FILES) – saknas den finns det inga ljud att spara än
try { importScripts('audio/voices.js'); } catch (e) {}
const VOICE_ASSETS = typeof VOICE_FILES !== 'undefined'
  ? Object.keys(VOICE_FILES).map(k => '/AliceLily/audio/' + k + '.mp3') : [];

const STATIC_ASSETS = [
  '/AliceLily/',
  '/AliceLily/index.html',
  '/AliceLily/paper.html',
  '/AliceLily/clay.html',
  '/AliceLily/turbo.html',
  '/AliceLily/content.js',
  '/AliceLily/audio/voices.js',
  '/AliceLily/manifest.json'
];

// Install: cache core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      // röstljuden sparas ett och ett, så att en enda saknad fil inte stoppar resten
      cache.addAll(STATIC_ASSETS).then(() =>
        Promise.all(VOICE_ASSETS.map(url => cache.add(url).catch(() => {}))))
    )
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network first, fall back to cache
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses (including Google Fonts)
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
