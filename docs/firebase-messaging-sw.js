importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"),importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");var firebaseConfig={apiKey:"AIzaSyAyLAppI7ls5auZbjV4jFLNSw-9IPJv5Hw",authDomain:"maxor-pwa.firebaseapp.com",projectId:"maxor-pwa",storageBucket:"maxor-pwa.appspot.com",messagingSenderId:"490787804854",appId:"1:490787804854:web:dee991a03e221487a4f817"};firebase.initializeApp(firebaseConfig);const messaging=firebase.messaging();messaging.onBackgroundMessage((function(a){return null})),self.addEventListener("push",(function(a){var e=a.data.json();try{var s=e.data;s.data=JSON.parse(s.data),console.log(s),self.registration.showNotification(e.notification.title,s)}catch(i){console.log("Push error happened: ",i)}}));