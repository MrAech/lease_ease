// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App';
// import './App.css';

// const container = document.getElementById('root');
// const root = createRoot(container);
// root.render(<App />);

// WITHOUT REDUX 

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import {
  IdentityKitProvider,
  IdentityKitTheme,
} from "@nfid/identitykit/react";
import {
  IdentityKitAuthType,
  NFIDW,
  Plug,
  InternetIdentity,
} from "@nfid/identitykit";
import "@nfid/identitykit/react/styles.css";
import { AuthProvider } from './StateManagement/useContext/useClient';
import "./App.css"
const signers = [NFIDW, Plug, InternetIdentity];
const canisterID = import.meta.env.CANISTER_ID_LEASERUST_BACKEND;
ReactDOM.createRoot(document.getElementById('root')).render(
  <IdentityKitProvider
    signers={signers}
    theme={IdentityKitTheme.SYSTEM}
    authType={IdentityKitAuthType.DELEGATION}
    signerClientOptions={{
      targets: [canisterID],
      retryTimes: 2
    }}
  >
  <React.StrictMode>
      <AuthProvider>
    <App />
      </AuthProvider>
  </React.StrictMode>,
  </IdentityKitProvider>
);




