import './registerServiceWorker';

import * as ReactDOM from 'react-dom/client';

import Authentication from './app/authentication';
import { StrictMode } from 'react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Authentication />
  </StrictMode>
);
