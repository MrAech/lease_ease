import React, { useState } from 'react';
import { LeaseRust_backend } from '../../../declarations/LeaseRust_backend';

const PropertyDetails = ({ property, userProfile, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Helper to format price
  const formatPrice = (bigIntPrice) => {
    if (!bigIntPrice) return "0";
    return Number(bigIntPrice) / 100000000n; // Converting from e8s
  };

  if (!property) {
    return <div>No property selected</div>;
  }

  const isTenant = userProfile?.role?.hasOwnProperty('Tenant');
  const canRequestRent = isTenant && property.status?.hasOwnProperty('Available');
  
  const handleRentRequest = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await LeaseRust_backend.request_rental(property.id);
      
      if ('Ok' in result) {
        setSuccess("Rental request sent successfully!");
      } else if ('Err' in result) {
        setError(`Failed to request rental: ${result.Err}`);
      }
    } catch (err) {
      console.error("Error requesting rental:", err);
      setError("An error occurred while requesting rental.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="property-details">
      <div className="property-header">
        <h2>{property.title}</h2>
        <button className="back-button" onClick={onBack}>Back to Listings</button>
      </div>

      <div className="property-images">
        {property.images && property.images.length > 0 ? (
          <img 
            src={property.images[0]} 
            alt={property.title} 
            className="main-image" 
          />
        ) : (
          <div className="placeholder-image">No image available</div>
        )}
      </div>

      <div className="property-info-section">
        <div className="property-description">
          <h3>Description</h3>
          <p>{property.description}</p>
        </div>

        <div className="property-metadata">
          <div className="metadata-item">
            <strong>Location:</strong> {property.location}
          </div>
          <div className="metadata-item">
            <strong>Type:</strong> {Object.keys(property.property_type)[0]}
          </div>
          <div className="metadata-item">
            <strong>Monthly Rent:</strong> ${formatPrice(property.monthly_rent)}
          </div>
          <div className="metadata-item">
            <strong>Security Deposit:</strong> ${formatPrice(property.security_deposit)}
          </div>
          <div className="metadata-item">
            <strong>Status:</strong> {Object.keys(property.status)[0]}
          </div>
        </div>

        {property.amenities && property.amenities.length > 0 && (
          <div className="property-amenities">
            <h3>Amenities</h3>
            <ul>
              {property.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="property-actions">
        {canRequestRent && (
          <div>
            <button 
              className="action-button"
              onClick={handleRentRequest}
              disabled={loading}
            >
              {loading ? "Processing..." : "Request to Rent"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails; 