import React, { useState, useEffect } from 'react';

const UserProfile = ({ userProfile, onSubmit, onDelete, error, isCreating = false }) => {
  const [formData, setFormData] = useState({
    role: userProfile?.role || { Tenant: null },
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || ''
  });
  const [loading, setLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Debug log on mount
  useEffect(() => {
    console.log("Initial formData:", JSON.stringify(formData));
    console.log("Initial role:", JSON.stringify(formData.role));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'role') {
      let role;
      if (value === 'landlord') {
        role = { Landlord: null };
      } else if (value === 'tenant') {
        role = { Tenant: null };
      } else if (value === 'admin') {
        role = { Admin: null };
      }
      console.log("Setting role to:", JSON.stringify(role));
      setFormData({ ...formData, role });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data before submission
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (err) {
      console.error('Error submitting profile:', err);
      alert("An error occurred while submitting the profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await onDelete();
    } catch (err) {
      console.error('Error deleting profile:', err);
    } finally {
      setLoading(false);
      setShowConfirmDelete(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  // Helper to determine the role value for the select input
  const getRoleValue = (role) => {
    if (!role) return 'tenant';
    if (role.hasOwnProperty('Landlord')) return 'landlord';
    if (role.hasOwnProperty('Tenant')) return 'tenant';
    if (role.hasOwnProperty('Admin')) return 'admin';
    return 'tenant';
  };

  return (
    <div className="form-container">
      <h2 className="form-title">
        {isCreating ? 'Create Your Profile' : 'Update Your Profile'}
      </h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="role">
            I am a:
          </label>
          <select
            id="role"
            name="role"
            value={getRoleValue(formData.role)}
            onChange={handleChange}
            required
            disabled={!isCreating}
          >
            <option value="tenant">Tenant</option>
            <option value="landlord">Landlord</option>
            {/* Admin role is typically not selectable by users */}
            {getRoleValue(formData.role) === 'admin' && (
              <option value="admin">Admin</option>
            )}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Full Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="phone">
            Phone Number:
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </div>
        
        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading 
            ? 'Saving...' 
            : isCreating 
              ? 'Create Profile' 
              : 'Update Profile'
          }
        </button>

        {!isCreating && onDelete && (
          <button
            type="button"
            className="delete-button"
            onClick={handleDeleteClick}
            disabled={loading}
          >
            Delete Account
          </button>
        )}
      </form>

      {showConfirmDelete && (
        <div className="confirm-delete-overlay">
          <div className="confirm-delete-modal">
            <h3>Confirm Account Deletion</h3>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="confirm-buttons">
              <button 
                className="cancel-button" 
                onClick={handleCancelDelete}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="delete-confirm-button" 
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
