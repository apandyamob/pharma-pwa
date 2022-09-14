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
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [token] = useState(null);
  askForPermissionToReceiveNotifications();

  onMessageListener()
    .then((payload: any) => {
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      setShow(true);
      console.log(payload);
    })
    .catch((err: any) => console.log('failed: ', err));

  const onShowNotificationClicked = () => {
    setNotification({
      title: 'Notification',
      body: 'This is a test notification',
    });
    setShow(true);
  };

  return (
    <div className="App">
      <Toast
        onClose={() => setShow(false)}
        show={show}
        delay={3000}
        autohide
        animation
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          minWidth: 200,
        }}
      >
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
          <strong className="mr-auto">{notification.title}</strong>
          <small>just now</small>
        </Toast.Header>
        <Toast.Body>{notification.body}</Toast.Body>
      </Toast>
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
