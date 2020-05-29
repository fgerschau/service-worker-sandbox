(function(){
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(function(registration) {
      console.log(registration);

    }).catch(function(err) {
      console.log(err);
    });

    // 
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

    const getVersion = () => postMessage('VERSION', 'active')
    const clientsClaim = () => postMessage('CLIENTS_CLAIM', 'active')
    const skipWaiting = () => postMessage('SKIP_WAITING', 'waiting')

    document.getElementById('skip_waiting').onclick = skipWaiting;
    document.getElementById('get_version').onclick = getVersion;
    document.getElementById('clients_claim').onclick = clientsClaim;
    document.getElementById('update').onclick = update;

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
  }
}());
