/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

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

        registration.update();

        setInterval(() => {
          registration.update();
          console.debug(
            'checked for update...',
            registration.installing,
            registration.waiting
          );
        }, 1000 * 60 * 1); // 1 min

        registration.onupdatefound = () => {
          const installingServiceWorker = registration.installing;
          console.log('service worker update found', installingServiceWorker);

          if (installingServiceWorker === null) {
            console.log('installing worker null');
            return;
          }

          // track installation states
          installingServiceWorker.onstatechange = () => {
            console.log(
              'service worker install state changed',
              installingServiceWorker.state
            );

            // steps to perform on installed state
            if (installingServiceWorker.state === 'installed') {
              console.log(
                'service worker installed but waiting for activate',
                navigator.serviceWorker.controller
              );
              // below condition will ensure that confirm modal not shown for the first installation
              if (navigator.serviceWorker.controller) {
                // eslint-disable-next-line no-alert
                if (
                  confirm('Update available! Do you want to update now?') ===
                  true
                ) {
                  console.log('skip waiting and load new changes');

                  // This allows the web app to trigger skipWaiting via
                  installingServiceWorker.postMessage({
                    type: 'SKIP_WAITING',
                  });
                }
              }
            }

            // reload once worker is installed and activated
            if (installingServiceWorker.state === 'activated') {
              console.log('came to installing worker activated state');
              window.location.reload();
            }
          };
        };
      },
      (error) => {
        console.log('Service worker registration failed:', error);
      }
    );
  });
};

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
