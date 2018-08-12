importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js'
);

workbox.setConfig({
  debug: false
});

const daySeconds = days => days * 24 * 60 * 60;

const cacheNameParts = {
  prefix: 'phonic',
  suffix: 'v1.0.3'
};

const getCacheName = name =>
  `${cacheNameParts.prefix}-${name}-${cacheNameParts.suffix}`;

self.addEventListener('activate', event => {
  const rName = new RegExp(getCacheName('[a-z]*?'));
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(name => !rName.test(name))
            .map(name => caches.delete(name))
        )
      )
  );
});

workbox.routing.registerRoute(
  /(\/|index\.html)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: getCacheName('html')
  })
);

workbox.routing.registerRoute(
  /\.(css|js|json)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: getCacheName('assets')
  })
);

workbox.routing.registerRoute(
  /\.(aac|flac|m4a|mp3|ogg|webm)$/,
  workbox.strategies.cacheFirst({
    cacheName: getCacheName('audio'),
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 10
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\.(gif|jpg|jpeg|png|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: getCacheName('images'),
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: daySeconds(30),
        maxEntries: 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('https://(.*?\.?)(unpkg|googleapis|gstatic).com/(.*)'),
  workbox.strategies.cacheFirst({
    cacheName: getCacheName('vendor'),
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: daySeconds(30),
        maxEntries: 30
      })
    ]
  })
);
