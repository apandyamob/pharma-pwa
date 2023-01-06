import { getMessaging, getToken, onMessage } from 'firebase/messaging';

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyB22_z4Karwovf3gCjPdFYgTZ_Ib2c3i6Y',
  authDomain: 'maxor-pwa.firebaseapp.com',
  projectId: 'maxor-pwa',
  storageBucket: 'maxor-pwa.appspot.com',
  messagingSenderId: '1082575576782',
  appId: '1:1082575576782:web:0f9dc48316a9896665ba9f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const askForPermissionToReceiveNotifications = (setToken?: any) => {
  try {
    return getToken(messaging, {
      vapidKey:
        'BFffdqLbxNEDVTEQC_pHfvep4wnJ6fbwaFJnojs3cjxqCTV-Y7L8Zp5M-wHFPrhmUWap4pEheciah-xluB6Iobk',
    })
      .then((currentToken) => {
        if (currentToken) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          setToken ? setToken(currentToken) : '';
          console.log('current token for client: ', currentToken);
          // Track the token -> client mapping, by sending to backend server
          // show on the UI that permission is secured
        } else {
          console.log(
            'No registration token available. Request permission to generate one.'
          );
          // shows on the UI that permission is required
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // catch error while creating client token
      });
  } catch (ex: any) {
    return 'fake token' + ex.toString();
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
