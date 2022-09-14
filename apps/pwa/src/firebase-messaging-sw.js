/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
);

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: 'AIzaSyAyLAppI7ls5auZbjV4jFLNSw-9IPJv5Hw',
  authDomain: 'pharmacy-pwa.firebaseapp.com',
  projectId: 'pharmacy-pwa',
  storageBucket: 'pharmacy-pwa.appspot.com',
  messagingSenderId: '490787804854',
  appId: '1:490787804854:web:dee991a03e221487a4f817',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    tag: 'notification-1',
  };
  console.log('I am from service worker');
  self.registration.showNotification(notificationTitle, notificationOptions);
});
