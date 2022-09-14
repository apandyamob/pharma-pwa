import {
  askForPermissionToReceiveNotifications,
  onMessageListener,
} from '../firebase';

import NxWelcome from './nx-welcome';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react';

export function App() {
  const [token, setToken] = useState('');
  askForPermissionToReceiveNotifications(setToken);

  onMessageListener()
    .then((payload: any) => {
      alert(payload);
    })
    .catch((err) => console.log('failed: ', err));

  return (
    <>
      TOKEN: {token}
      <NxWelcome title="pwa" />
      <div />
    </>
  );
}

export default App;
