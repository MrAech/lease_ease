import React, { useState } from "react";
import { useAuth } from "../StateManagement/useContext/useClient";
import { ConnectWallet } from "@nfid/identitykit/react";
import { useNavigate } from "react-router-dom";
const ConnectBtn = ({ onClick }) => (
  <>
    <button onClick={onClick} className=" bg-white">
      <div className="login-btn">Connect Wallet</div>
    </button>
  </>
);
const Login = ( ) => {
  const navigate = useNavigate();
  const { isAuthenticated, principal,actor } = useAuth();
 

  return (
    <div className="login-container bgcheck">
      <h2>Welcome to LeaseRust</h2>
      <p>A decentralized rental marketplace on the Internet Computer</p>
       

      {!isAuthenticated && (
        <div className="hidden font-posterama md:block">
          <ConnectWallet
            connectButtonComponent={ConnectBtn}
            className="rounded-full bg-black"
          />
        </div>
      )}
      {isAuthenticated && (
        <button  className=" bg-white"  onClick={() => navigate("/property-management")}>
          <div className="login-btn">Sign Up</div>
        </button>
      )}
      <p className="login-note">
        Note: This will open Internet Identity authentication in a popup window.
        After successful authentication, you'll be redirected back to this page.
      </p>

      <div
        style={{
          marginTop: "2rem",
          fontSize: "0.9rem",
          color: "var(--gray-color)",
        }}
      >
        <p>LeaseRust allows you to:</p>
        <ul>
          <li>Browse available rental properties</li>
          <li>List your property for rent</li>
          <li>Manage rental agreements securely</li>
          <li>Handle payments using Internet Computer tokens</li>
        </ul>
      </div>
    </div>
  );
};

export default Login;
