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

          installingServiceWorker.onstatechange = () => {
            console.log(
              'service worker install state changed',
              installingServiceWorker.state
            );
            if (installingServiceWorker.state === 'installed') {
              console.log(
                'service worker installed but waiting for activate',
                navigator.serviceWorker.controller
              );
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

            if (installingServiceWorker.state === 'activated') {
              console.log('came to installing worker activated state');
              window.location.reload();
            }
          };
        };

        // const waitingServiceWorker = registration.waiting;
        // console.log(
        //   'came to waitingServiceWorker part',
        //   waitingServiceWorker
        // );

        // if (waitingServiceWorker === null) {
        //   console.log('waiting worker null');
        //   return;
        // }
        // waitingServiceWorker.addEventListener('statechange', () => {
        //   console.log(
        //     'service worker install state changed',
        //     waitingServiceWorker.state
        //   );

        //   if (waitingServiceWorker.state === 'installed') {
        //     console.log('came to waiting worker installed state');
        //     window.skipWaiting();
        //     window.location.reload();
        //   }
        // });
      },
      (error) => {
        console.log('Service worker registration failed:', error);
      }
    );
  });

  // window.addEventListener('message', (event) => {
  //   console.log('service worker message listener', event.data);
  //   if (event.data && event.data.type === 'SKIP_WAITING') {
  //     console.log('service worker skip waiting');
  //     window.skipWaiting();
  //   }

  //   if (event.data.action === 'skipWaiting') {
  //     console.log('data action, service worker skip waiting');
  //     self.skipWaiting();
  //   }
  // });
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
