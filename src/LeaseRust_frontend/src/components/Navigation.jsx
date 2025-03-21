import React from 'react';

const Navigation = ({ userProfile, view, setView, onLogout }) => {
  const isLandlord = userProfile?.role?.hasOwnProperty('Landlord') || userProfile?.role?.hasOwnProperty('Admin');
  
  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-logo" onClick={() => setView('properties')}>
          LeaseRust
        </div>
        
        <div className="nav-links">
          <div 
            className={`nav-link ${view === 'properties' ? 'active' : ''}`}
            onClick={() => setView('properties')}
          >
            Browse Properties
          </div>
          
          {isLandlord && (
            <div 
              className={`nav-link ${view === 'createProperty' ? 'active' : ''}`}
              onClick={() => setView('createProperty')}
            >
              List Property
            </div>
          )}
          
          <div 
            className={`nav-link ${view === 'profile' ? 'active' : ''}`}
            onClick={() => setView('profile')}
          >
            My Profile
          </div>
        </div>
        
        <div className="nav-user">
          <div>
            Hello, {userProfile?.name || 'User'}
            <span style={{ 
              fontSize: '0.8rem', 
              marginLeft: '0.5rem', 
              color: isLandlord ? 'var(--secondary-color)' : 'var(--primary-color)' 
            }}>
              {isLandlord ? '(Landlord)' : '(Tenant)'}
            </span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 