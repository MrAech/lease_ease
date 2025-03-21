import React from 'react';

const PropertyList = ({ properties, onSelectProperty }) => {
  // Helper to format price
  const formatPrice = (price) => {
    // Convert BigInt to string and format it
    return Number(price.toString()).toLocaleString();
  };

  // Helper to get status display text and class
  const getStatusInfo = (status) => {
    if (status?.hasOwnProperty('Available')) {
      return { text: 'Available', className: 'status-available' };
    } else if (status?.hasOwnProperty('Rented')) {
      return { text: 'Rented', className: 'status-rented' };
    } else if (status?.hasOwnProperty('Maintenance')) {
      return { text: 'Maintenance', className: 'status-maintenance' };
    } else if (status?.hasOwnProperty('Reserved')) {
      return { text: 'Reserved', className: 'status-reserved' };
    }
    return { text: 'Unknown', className: '' };
  };

  const placeholderImage = 'https://via.placeholder.com/600x400?text=Property+Image';

  if (properties.length === 0) {
    return (
      <div className="empty-state">
        <h2>No properties available</h2>
        <p>There are currently no properties listed. Check back later or list your own property.</p>
      </div>
    );
  }
  
  return (
    <div className="property-list-container">
      <h2>Available Properties</h2>
      {properties.length === 0 && <div className="error-message">No properties available at this time.</div>}

      <div className="property-list">
        {properties.map((property) => {
          const statusInfo = getStatusInfo(property.status);
          
          return (
            <div 
              key={property.id.toString()} 
              className="property-card"
              onClick={() => onSelectProperty(property)}
            >
              <img 
                src={property.images?.length > 0 ? property.images[0] : placeholderImage} 
                alt={property.title}
                className="property-image"
              />
              <div className="property-info">
                <h3 className="property-title">{property.title}</h3>
                <p className="property-location">{property.location}</p>
                <div className="property-price-info">
                  <span className="property-price">${formatPrice(property.price)}</span>
                  <span className={`property-status ${statusInfo.className}`}>
                    {statusInfo.text}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyList;
