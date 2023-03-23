/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches;
};

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
    const originalSW = navigator.serviceWorker.controller;
    // let refreshing: boolean;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (originalSW) {
        // This is due to an update.
        // if (refreshing) return; // prevent infinite refresh loop when you use "Update on Reload"
        // refreshing = true;
        console.log('Controller loaded');
        console.log('detected new SW');
        localStorage.setItem('updatedPWA', 'true');
        window.location.reload();
      } else {
        // This is due to a SW taking control for the first time.
        console.log('first SW');
      }
    });

    navigator.serviceWorker.register('./service-worker.js').then(
      function (registration) {
        console.log('Service worker registration succeeded:', registration);
        // below condition will ensure that confirm modal not shown for the first installation
        // if (!navigator.serviceWorker.controller) {
        // console.log('controller for first time');
        // The window client isn't currently controlled so it's a new service
        // worker that will activate immediately
        // return;
        // }

        registration.update();

        setInterval(() => {
          registration.update();
          console.debug(
            'checked for update...',
            registration.installing,
            registration.waiting
          );
        }, 1000 * 60 * 0.1); // 1 min

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

              // eslint-disable-next-line no-alert
              // if (
              //   confirm('Update available! Do you want to update now?') === true
              // ) {
              console.log('skip waiting and load new changes');

              // This allows the web app to trigger skipWaiting via
              installingServiceWorker.postMessage({
                type: 'SKIP_WAITING',
              });
              // }
            }

            // reload once worker is installed and activated
            if (installingServiceWorker.state === 'activated') {
              console.log('came to installing worker activated state');
              localStorage.setItem('updatedPWA', 'true');
              window.location.reload();
            }
          };
        };

        const waitingServiceWorker = registration.waiting;

        if (waitingServiceWorker) {
          alert('waiting worker found');
        }
      },
      (error) => {
        console.log('Service worker registration failed:', error);
      }
    );
  });
};

const disableUserSelect = () => {
  if (!isPWA()) {
    return;
  }
  document.querySelectorAll('html,body,#root').forEach((e: any) => {
    e.style['user-select'] = 'none';
  });
};

registerServiceWorker();
disableUserSelect();
