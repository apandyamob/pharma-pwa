import base64url from 'base64url';
import logo from '../assets/favicon-32x32.png';
import { useEffect, useState } from 'react';

function BrowseName() {
  const userAgentString = navigator.userAgent;

  // Detect Chrome
  let chromeAgent = userAgentString.indexOf('Chrome') > -1;

  // Detect Firefox
  const firefoxAgent = userAgentString.indexOf('Firefox') > -1;

  // Detect Safari
  let safariAgent = userAgentString.indexOf('Safari') > -1;

  // Discard Safari since it also matches Chrome
  if (chromeAgent && safariAgent) safariAgent = false;

  // Detect Opera
  const operaAgent = userAgentString.indexOf('OP') > -1;

  // Discard Chrome since it also matches Opera
  if (chromeAgent && operaAgent) chromeAgent = false;

  if (safariAgent) return <span>Safari browser</span>;

  if (chromeAgent) return <span>Chrome browser</span>;

  if (operaAgent) return <span>Opera browser</span>;

  if (firefoxAgent) return <span>Firefox browser</span>;

  return <>Unable to detect browser</>;
}

const options = {
  publicKey: {
    // Relying Party (a.k.a. - Service):
    rp: {
      name: 'PWA Biometric authentication',
    },
    user: {
      displayName: 'Aakash Pandya',
      id: new Uint8Array(16),
      name: 'aakashkpandya@gmail.com ',
    },

    pubKeyCredParams: [
      {
        type: 'public-key',
        alg: -7,
      },
    ],

    attestation: 'none',
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'required',
    },
    timeout: 60000,

    challenge: new Uint8Array([
      // must be a cryptographically random number sent from a server
      0x8c, 0x0a, 0x26, 0xff, 0x22, 0x91, 0xc1, 0xe9, 0xb9, 0x4e, 0x2e, 0x17,
      0x1a, 0x98, 0x6a, 0x73, 0x71, 0x9d, 0x43, 0x48, 0xd5, 0xa7, 0x6a, 0x15,
      0x7e, 0x38, 0x94, 0x52, 0x77, 0x97, 0x0f, 0xef,
    ]).buffer,
  },
};

function DeviceDetails() {
  return (
    <>
      <b>User Agent</b> :{navigator.userAgent}
      <br />
      <b>Browser Name</b> : <BrowseName />
      <br />
      <b>Operating System Detection</b> :
      {['Windows', 'Linux', 'Mac'].find(
        (v) => navigator.appVersion.indexOf(v) >= 0
      )}
      <br />
      {(navigator as any).standalone === undefined && (
        <b> user is not on an iPadOS or iOS device.</b>
      )}
      <br />
      {(navigator as any).standalone === false && (
        <b> PWA is getting used into the browser as website</b>
      )}
      <br />
      {(navigator as any).standalone === true && (
        <b> PWA is getting used as an app</b>
      )}
      <img src={logo} className="App-logo" alt="logo" />
    </>
  );
}

export default function Authentication() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>();
  const registerCredential = async () => {
    try {
      const cred: any = await navigator.credentials.create(options as any);
      console.log('registration', cred);
      localStorage.setItem(`credId`, cred.id);

      base64url.encode(cred.rawId);
    } catch (ex) {
      console.log(ex);
      alert('FAILURE');
    }
  };

  const validateCredential = async () => {
    try {
      const cred = await navigator.credentials.get(options as any);
      console.log('validation', cred);
    } catch (ex) {
      console.log(ex);
      alert('FAILURE');
    }
  };

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e: any) => {
      // Prevents the default mini-infobar or install dialog from appearing on mobile
      e.preventDefault();
      // Save the event because you’ll need to trigger it later.
      setDeferredPrompt(e);
    });

    setTimeout(() => handleInstallButtonClick(), 100);
  }, []);

  const handleInstallButtonClick = () => {
    deferredPrompt?.prompt();
  };

  return (
    <>
      <DeviceDetails />
      <button id="register" onClick={registerCredential}>
        Register Credential 6.0
      </button>

      <br />
      <br />

      <button id="register" onClick={validateCredential}>
        Validate Credential
      </button>

      <button onClick={handleInstallButtonClick}>Install PWA</button>
    </>
  );
}
