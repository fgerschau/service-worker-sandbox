(function(){
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(function(registration) {
      console.log(registration);

    }).catch(function(err) {
      console.log(err);
    });

    const setCacheVersion = (version) => {
      const currentElement = document.getElementById('version-cache');
      const versionText = document.createTextNode(`VERSION: ${version}`);
      const newElement = document.createElement('div');
      newElement.id = 'version-cache';
      newElement.appendChild(versionText);
      currentElement.replaceWith(newElement);
    }
    const postMessage = (type, swState) => {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration[swState]) {
          registration[swState].postMessage({ type })
        }
      });
    };

    const update = () => {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update();
      });
    };

    const fetchCacheVersion = () => {
      fetch('/cache-version')
        .then(res => res.json())
        .then((res) => {
          if (res.version) {
            setCacheVersion(res.version);
          }
        })
        .catch(e => console.error(e));
    }

    const getVersion = () => postMessage('VERSION', 'active')
    const getBothVersions = () => {
      fetchCacheVersion();
      getVersion();
    };

    const clientsClaim = () => {
      postMessage('CLIENTS_CLAIM', 'active');
      getBothVersions();
    }

    const skipWaiting = () => {
      postMessage('SKIP_WAITING', 'waiting');
      getBothVersions();
    }

    document.getElementById('skip_waiting').onclick = skipWaiting;
    document.getElementById('get_version').onclick = getVersion;
    document.getElementById('clients_claim').onclick = clientsClaim;
    document.getElementById('update').onclick = update;
    document.getElementById('get_cache_version').onclick = fetchCacheVersion;

    navigator.serviceWorker.onmessage = (event) => {
      if (event.data && event.data.type === 'VERSION') {
        const versionElement = document.createTextNode(`VERSION: ${event.data.version}`);
        document.id = 'VERSION';
        const versionWrapper = document.createElement('div');
        versionWrapper.id = 'version';
        versionWrapper.appendChild(versionElement);
        document.getElementById('version').replaceWith(versionWrapper);
      }
    };

    getVersion();
    navigator.serviceWorker.ready.then((registration) => {
      fetchCacheVersion();
    });
  }
}());
