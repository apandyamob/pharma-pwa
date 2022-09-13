import NxWelcome from './nx-welcome';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { askForPermissionToReceiveNotifications } from '../firebase';
import styles from './app.module.css';

export function App() {
  askForPermissionToReceiveNotifications();

  return (
    <>
      <NxWelcome title="pwa" />
      <div />
    </>
  );
}

export default App;
