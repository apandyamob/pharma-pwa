import 'bootstrap/dist/css/bootstrap.min.css';

import { Button, Toast } from 'react-bootstrap';
import {
  askForPermissionToReceiveNotifications,
  onMessageListener,
} from '../firebase';

import logo from '../assets/icons/logo.png';
import { useState } from 'react';

export default function App() {
  const [show, setShow] = useState(false);
  const [token, setToken] = useState(null);
  askForPermissionToReceiveNotifications(setToken);

  onMessageListener()
    .then((payload: any) => {
      new Notification(payload.notification.title, payload.notification.body);
      setShow(true);
      console.log(payload);
    })
    .catch((err: any) => console.log('failed: ', err));

  const onShowNotificationClicked = () => {
    new Notification('Sample notification', { body: 'Hi there' });

    setShow(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        {token && <h1> Notification permission enabled 👍🏻 </h1>}
        {!token && <h1> Need notification permission ❗️ </h1>}
        <img src={logo} className="App-logo" alt="logo" />
        <br />
        <br />
        <br />
        <br /> <b>your token is below </b>
        <br />
        {token}
        <br />
        <br />
        <br />
        <Button onClick={() => onShowNotificationClicked()}>
          Example Toast
        </Button>
      </header>
    </div>
  );
}
