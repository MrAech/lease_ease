import React, { useState } from 'react';

const NamePrompt = ({ onSubmit, error }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Tenant'); // Default role


  const handleSubmit = (e) => {
    e.preventDefault();
    if (name) {
      onSubmit({ name, role }); 

    }
  };

  return (
    <div className="name-prompt">
      <h2>Welcome! Please enter your name to continue:</h2>
      <form onSubmit={handleSubmit}>

        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Tenant">Tenant</option>
            <option value="Landlord">Landlord</option>

          </select>
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          required
        />
        <button type="submit">Submit</button>
        <p>{error}</p>

      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default NamePrompt;
