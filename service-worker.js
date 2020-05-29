const version = '$version';
const currentCache = {
  offline: 'offline-cache' + version
};

const offlineUrl = '/static/html/offline.html';
const errorUrl = '/static/html/error.html';

const vm = this;

vm.addEventListener('install', function(event) {

    // Offline
    event.waitUntil(
        caches.open(currentCache.offline).then(function(cache) {
            return cache.addAll([
                '/static/images/offline.svg',
                offlineUrl,
                errorUrl
            ]);
        })
    );
});

vm.addEventListener('fetch', function(event) {
    if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
            fetch(event.request)
            .then(function(response){
                if (!response.ok) {
                    // Fallback response
                    console.log('Status: ' + response.status);
                    return caches.match(errorUrl);
                }

                return response;
            })
            .catch(function(error) {
                // Offline response
                console.log(error);
                return caches.match(offlineUrl);
            })
        );
    } else {

      event.respondWith(caches.match(event.request)
        .then(function (response) {
          // Used for getting the version of the service worker that is
          // currently controlling the page
          const url = new URL(event.request.url);
          if (url.origin == location.origin && url.pathname == '/cache-version') {
            return new Response(JSON.stringify({ version }), {
              headers: {'Content-Type': 'application/json'}
            });
          }

          return response || fetch(event.request);
        })
      );
    }
});

vm.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'VERSION') {
    self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
      if (clients && clients.length) {
        for (let i = 0; i < clients.length; i++) {
          clients[i].postMessage({
            version,
            type: 'VERSION',
          });
        }
      }
    });
  }

  if (event.data.type === 'SKIP_WAITING') {
    console.log('Skip waiting');
    self.skipWaiting();
  }

  if (event.data.type === 'CLIENTS_CLAIM') {
    console.log('Clients claim');
    self.clients.claim();
  }
});
