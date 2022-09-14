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
  return null;
});

self.addEventListener('push', function (event) {
  var pushData = event.data.json();
  try {
    var notificationData = pushData.data;
    notificationData.data = JSON.parse(notificationData.data);
    console.log(notificationData);
    self.registration.showNotification(
      pushData.notification.title,
      notificationData
    );
  } catch (err) {
    console.log('Push error happened: ', err);
  }
});
