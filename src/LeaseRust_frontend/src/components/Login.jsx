import React, { useState } from 'react';

const Login = ({ onLogin, error }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await onLogin();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome to LeaseRust</h2>
      <p>A decentralized rental marketplace on the Internet Computer</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <button 
        className="login-btn" 
        onClick={handleLogin} 
        disabled={loading}
      >
        {loading ? 'Connecting...' : 'Login with Internet Identity'}
      </button>
      
      <p className="login-note">
        Note: This will open Internet Identity authentication in a popup window. 
        After successful authentication, you'll be redirected back to this page.
      </p>
      
      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-color)' }}>
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