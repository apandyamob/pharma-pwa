/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
  skipWaiting: () => void;
}

const registerServiceWorker = () => {
  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
  );

  const isServiceWorkerSupported = 'serviceWorker' in navigator && !isLocalhost;

  if (!isServiceWorkerSupported) {
    console.log('Service workers are not supported.');
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').then(
      function (registration) {
        console.log('Service worker registration succeeded:', registration);

        setInterval(() => {
          registration.update();
          console.debug('checked for update...');
        }, 1000 * 60 * 1); // 1 min

        registration.onupdatefound = () => {
          const installingServiceWorker = registration.installing;
          console.log('service worker update found', installingServiceWorker);

          if (installingServiceWorker) {
            installingServiceWorker.onstatechange = () => {
              console.log(
                'service worker install state changed',
                installingServiceWorker.state
              );
              if (installingServiceWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // eslint-disable-next-line no-alert
                  if (
                    confirm(
                      'Update available! To update, close all windows and reopen.'
                    ) === true
                  ) {
                    window.location.reload();
                  }
                }
              }
            };
          }

          const waitingServiceWorker = registration.waiting;
          console.log(
            'came to waitingServiceWorker part',
            waitingServiceWorker
          );

          if (waitingServiceWorker) {
            waitingServiceWorker.onstatechange = () => {
              console.log(
                'service worker install state changed',
                waitingServiceWorker.state
              );
              if (waitingServiceWorker.state === 'activated') {
                window.location.reload();
              }
            };
            waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        };
      },
      (error) => {
        console.log('Service worker registration failed:', error);
      }
    );
  });
};

// This allows the web app to trigger skipWaiting via
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('service worker skip waiting');
    self.skipWaiting();
  }
});

const disableUserSelect = () => {
  const isPWA = () => {
    return window.matchMedia('(display-mode: standalone)').matches;
  };
  if (!isPWA()) {
    return;
  }
  document.querySelectorAll('html,body,#root').forEach((e: any) => {
    e.style['user-select'] = 'none';
  });
};

registerServiceWorker();
disableUserSelect();
