import base64url from 'base64url';
import logo from '../assets/favicon-32x32.png';
import { useEffect, useState } from 'react';
declare global {
  interface Window {
    cbor?: any;
  }
}
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
  const [currentUser, setCurrentUser] = useState('3');
  const [
    isDeviceSupportsDeferredInstallation,
    setIsDeviceSupportsDeferredInstallation,
  ] = useState(false);
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
    const isUpdatedPWA = localStorage.getItem('updatedPWA');
    if (isUpdatedPWA) {
      alert('Application has been updated!');
      localStorage.removeItem('updatedPWA');
    }
  }, []);
  const handleInstallButtonClick = () => {
    console.log('deferredPrompt', deferredPrompt);
    try {
      deferredPrompt?.prompt();
    } catch (ex) {
      alert(ex);
      console.log(ex);
    }
  };

  async function bioMetricCheck(userNumber: number) {
    const user = users[userNumber];
    if (window.PublicKeyCredential) {
      // do your webauthn stuff
      const publicKeyCredentialCreationOptions = {
        challenge: Uint8Array.from(user.challenge as string, (c) =>
          c.charCodeAt(0)
        ),
        rp: {
          name: 'Security',
          id: 'apandyamob.github.io',
          // id: 'localhost',
        },
        user: user.data,
        pubKeyCredParams: [{ alg: -7, type: 'public-key' as const }],
        authenticatorSelection: {
          authenticatorAttachment: 'platform' as const,
        },
        timeout: 60000,
        attestation: 'direct' as const,
      };

      try {
        const credential = (await navigator.credentials.create({
          publicKey: publicKeyCredentialCreationOptions,
        })) as any;
        console.log(
          'TCL ~ file: index.tsx:40 ~ bioMetricCheck ~ credential:',
          user.data.displayName,
          credential
        );
        // from doc
        // const clientDataObj = parseClientObject(credential)
        const decodedAttestationObj = decodeAttestation(
          credential.response.attestationObject
        );

        const { authData } = decodedAttestationObj as any;
        const credsData = parseAuthenticatorData(authData);

        credentialIds.push(credsData.credentialId);
        credentialIdsString.push(toBase64url(credsData.credentialId));

        if (userNumber === 0) {
          bioMetricCheck(1);
          return;
        }
        if (userNumber === 1) {
          bioMetricCheck(2);
          return;
        }
      } catch (error) {
        console.log(
          'TCL ~ file: index.tsx:187 ~ bioMetricCheck ~ error:',
          error
        );
      }
    } else {
      // wah-wah, back to passwords for you
    }
  }

  async function loginUser() {
    const selectedUser = parseInt(currentUser, 10);
    const allowCredentials =
      selectedUser === 3 ? credentialIds : [credentialIds[selectedUser]];

    const publicKeyCredentialRequestOptions = {
      challenge: Uint8Array.from('final-challenge', (c) => c.charCodeAt(0)),
      allowCredentials: allowCredentials.map((id) => ({
        id,
        type: 'public-key',
      })),
      timeout: 60000,
    } as any;
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });
    console.log(
      'TCL ~ file: index.tsx:144 ~ loginUser ~ assertion:',
      assertion
    );
    alert(
      users[credentialIdsString.indexOf(`${assertion.id}=`)].data.displayName
    );
  }

  function toBuffer(txt: string): ArrayBuffer {
    return Uint8Array.from(txt, (c) => c.charCodeAt(0)).buffer;
  }

  function toBase64url(buffer: ArrayBuffer): string {
    const txt = btoa(parseBuffer(buffer)); // base64
    return txt.replace(/\+/g, '-').replace(/\//g, '_');
  }

  function parseBuffer(buffer: ArrayBuffer): string {
    return String.fromCharCode(...new Uint8Array(buffer));
  }

  function parseBase64url(txt: string): ArrayBuffer {
    txt = txt.replace(/\-/g, '+').replace(/\_/g, '/'); // base64url -> base64
    return toBuffer(atob(txt));
  }

  function decodeUint8Arr(uint8Array) {
    return new TextDecoder('utf-8').decode(uint8Array);
  }

  function decodeAttestation(attestationObject) {
    return window.cbor?.decode(attestationObject);
  }

  function parseAuthenticatorData(authData) {
    // get the length of the credential ID
    const dataView = new DataView(new ArrayBuffer(2));
    const idLenBytes = authData.slice(53, 55);
    idLenBytes.forEach((value, index) => dataView.setUint8(index, value));
    const credentialIdLength = dataView.getUint16(0, false);
    // get the credential ID
    const credentialId = authData.slice(55, 55 + credentialIdLength);
    console.log(
      'TCL ~ file: authentication.tsx:259 ~ parseAuthenticatorData ~ credentialId:',
      credentialId
    );
    // get the public key object
    const publicKeyBytes = authData.slice(55 + credentialIdLength);
    // the publicKeyBytes are encoded again as CBOR
    const publicKeyObject = window.cbor.decode(publicKeyBytes.buffer);
    return {
      credentialId,
      publicKeyObject,
    };
  }
  return (
    <>
      <DeviceDetails />
      <button id="register" onClick={registerCredential}>
        Register Credential 6.5
      </button>
      <br />
      <br />
      <button id="register" onClick={validateCredential}>
        Validate Credential
      </button>

      <br />
      <button id="install" onClick={handleInstallButtonClick}>
        Install PWA
      </button>

      <br />
      <br />
      <br />
      <button onClick={() => bioMetricCheck(0)}>Register Fingerprint</button>

      <br />
      <select
        name="user"
        value={currentUser}
        onChange={(e) => setCurrentUser(e.target.value)}
        style={{ marginTop: '20px' }}
      >
        <option value="0">Sagar</option>
        <option value="1">Aakash</option>
        <option value="2">Jigar</option>
        <option value="3">All</option>
      </select>
      <br />
      <button onClick={() => loginUser()}>Login Fingerprint</button>
    </>
  );
}

const users = {
  0: {
    challenge: 'sagar-challenge',
    data: {
      id: Uint8Array.from('UZSL85T9AFC', (c) => c.charCodeAt(0)),
      name: 'sagar@local.com',
      displayName: 'Sagar',
    },
  },
  1: {
    challenge: 'aa-challenge',
    data: {
      id: Uint8Array.from('ASBDJKASDK', (c) => c.charCodeAt(0)),
      name: 'aakash@local.com',
      displayName: 'Aakash',
    },
  },
  2: {
    challenge: 'jj-challenge',
    data: {
      id: Uint8Array.from('ksabdkjbaj-asdnajsd-asdas-qasd', (c) =>
        c.charCodeAt(0)
      ),
      name: 'jigar@local.com',
      displayName: 'Jigar',
    },
  },
} as const;

const credentialIds: any[] = [];
const credentialIdsString: any[] = [];
