import React, { useState } from 'react';

const PropertyForm = ({ onSubmit, error }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: { Apartment: null },
    price: '',
    deposit: '',
    location: '',
    amenities: [],
    images: []
  });
  const [newAmenity, setNewAmenity] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'propertyType') {
      let propertyType;
      if (value === 'apartment') {
        propertyType = { Apartment: null };
      } else if (value === 'house') {
        propertyType = { House: null };
      } else if (value === 'commercial') {
        propertyType = { Commercial: null };
      } else if (value === 'land') {
        propertyType = { Land: null };
      }
      setFormData({ ...formData, propertyType });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() !== '') {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()]
      });
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index) => {
    const updatedAmenities = [...formData.amenities];
    updatedAmenities.splice(index, 1);
    setFormData({
      ...formData,
      amenities: updatedAmenities
    });
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() !== '') {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()]
      });
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages
    });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data before submission
    if (!formData.title || !formData.description || !formData.price || !formData.deposit || !formData.location) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (err) {
      console.error('Error creating property:', err);
      alert("An error occurred while creating the property. Please try again.");
    } finally {
      setLoading(false);
    }

  };

  // Helper to determine the property type value for the select input
  const getPropertyTypeValue = (propertyType) => {
    if (!propertyType) return 'apartment';
    if (propertyType.hasOwnProperty('Apartment')) return 'apartment';
    if (propertyType.hasOwnProperty('House')) return 'house';
    if (propertyType.hasOwnProperty('Commercial')) return 'commercial';
    if (propertyType.hasOwnProperty('Land')) return 'land';
    return 'apartment';
  };

  return (
    <div className="form-container">
      <h2 className="form-title">List a New Property</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Property Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter property title"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your property"
              rows="4"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="propertyType">
              Property Type:
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={getPropertyTypeValue(formData.propertyType)}
              onChange={handleChange}
              required
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="location">
              Location:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter property location"
              required
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Pricing</h3>
          
          <div className="form-group">
            <label className="form-label" htmlFor="price">
              Monthly Rent (USD):
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter monthly rent amount"
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="deposit">
              Security Deposit (USD):
            </label>
            <input
              type="number"
              id="deposit"
              name="deposit"
              value={formData.deposit}
              onChange={handleChange}
              placeholder="Enter security deposit amount"
              min="0"
              required
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Amenities</h3>
          
          <div className="form-group">
            <label className="form-label" htmlFor="newAmenity">
              Add Amenity:
            </label>
            <div className="input-group">
              <input
                type="text"
                id="newAmenity"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Enter an amenity (e.g., Wi-Fi, Pool, etc.)"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="secondary-button"
              >
                Add
              </button>
            </div>
          </div>
          
          {formData.amenities.length > 0 && (
            <div className="amenities-list">
              {formData.amenities.map((amenity, index) => (
                <div key={index} className="amenity-item">
                  {amenity}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(index)}
                    className="remove-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="form-section">
          <h3>Images</h3>
          
          <div className="form-group">
            <label className="form-label" htmlFor="newImageUrl">
              Add Image URL:
            </label>
            <div className="input-group">
              <input
                type="url"
                id="newImageUrl"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter an image URL"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="secondary-button"
              >
                Add
              </button>
            </div>
          </div>
          
          {formData.images.length > 0 && (
            <div className="images-list">
              {formData.images.map((image, index) => (
                <div key={index} className="image-item">
                  <img
                    src={image}
                    alt={`Property image ${index + 1}`}
                    className="thumbnail"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/100?text=Error';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="remove-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="form-buttons">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Creating Property...' : 'Create Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
