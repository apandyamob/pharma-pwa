// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  askForPermissionToReceiveNotifications,
  onMessageListener,
} from '../firebase';

import NxWelcome from './nx-welcome';

export function App() {
  askForPermissionToReceiveNotifications();

  onMessageListener()
    .then((payload: any) => {
      alert(payload);
    })
    .catch((err) => console.log('failed: ', err));

  return (
    <>
      <NxWelcome title="pwa" />
      <div />
    </>
  );
}

export default App;
