import { useState, useEffect } from 'react';
import { LeaseRust_backend } from '../../declarations/LeaseRust_backend';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import './App.css';

// Components
import Login from './components/Login';
import PropertyList from './components/PropertyList';
import PropertyForm from './components/PropertyForm';
import PropertyDetails from './components/PropertyDetails';
import UserProfile from './components/UserProfile';
import Navigation from './components/Navigation';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    initAuth();
    fetchProperties();
  }, []);
  
  useEffect(() => {
    // Clear error message when changing views
    setError(null);
  }, [view]);

  const initAuth = async () => {
    try {
      const authClient = await AuthClient.create();
      const isAuthed = await authClient.isAuthenticated();
      setIsAuthenticated(isAuthed);

      if (isAuthed) {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal();
        try {
          const profileResult = await LeaseRust_backend.get_user_profile(principal);
          if ('Ok' in profileResult) {
            setUserProfile(profileResult.Ok);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      const authClient = await AuthClient.create();
      await authClient.login({
        identityProvider: process.env.II_URL || 'https://identity.ic0.app',
        windowOpenerFeatures: 'width=500,height=600,resizable,scrollbars=yes,status=1',
        onSuccess: async () => {
          setIsAuthenticated(true);
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal();
          try {
            const profileResult = await LeaseRust_backend.get_user_profile(principal);
            if ('Ok' in profileResult) {
              setUserProfile(profileResult.Ok);
              setView('properties');
            } else {
              // User needs to create a profile
              setView('profile');
            }
          } catch (err) {
            console.error('Error fetching user profile:', err);
            setView('profile');
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login. Please try again.');
    }
  };

  const logout = async () => {
    try {
      const authClient = await AuthClient.create();
      await authClient.logout();
      setIsAuthenticated(false);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout. Please try again.');
    }
  };

  const fetchProperties = async () => {
    try {
      const propertiesResult = await LeaseRust_backend.get_all_properties();
      setProperties(propertiesResult);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to fetch properties. Please try again.');
    }
  };

  const createProperty = async (propertyData) => {
    try {
      const result = await LeaseRust_backend.create_property(
        propertyData.title,
        propertyData.description,
        propertyData.propertyType,
        BigInt(propertyData.price),
        BigInt(propertyData.deposit),
        propertyData.location,
        propertyData.amenities,
        propertyData.images
      );

      if ('Ok' in result) {
        fetchProperties();
        setView('properties');
      } else {
        setError(`Failed to create property: ${result.Err}`);
      }
    } catch (err) {
      console.error('Error creating property:', err);
      setError('Failed to create property. Please try again.');
    }
  };

  const createUserProfile = async (profileData) => {
    try {
      console.log("Creating profile with data:", JSON.stringify(profileData));
      
      // Debug the role format
      console.log("Role format:", JSON.stringify(profileData.role));
      
      const result = await LeaseRust_backend.create_user_profile(
        profileData.role,
        profileData.name,
        profileData.email,
        profileData.phone
      );

      console.log("Profile creation result:", JSON.stringify(result));

      if ('Ok' in result) {
        setUserProfile(result.Ok);
        setError(null);
        setView('properties');
      } else if ('Err' in result) {
        console.error("Error details:", JSON.stringify(result.Err));
        if (typeof result.Err === 'object') {
          const errorType = Object.keys(result.Err)[0];
          setError(`Failed to create profile: ${errorType}`);
        } else {
          setError(`Failed to create profile: ${String(result.Err)}`);
        }
      } else {
        setError('Failed to create profile: Unknown error');
      }
    } catch (err) {
      console.error('Error creating user profile:', err);
      console.error("Error details:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      setError(`Failed to create profile: ${err.message || 'Unknown error'}`);
    }
  };

  const deleteUserProfile = async () => {
    try {
      const result = await LeaseRust_backend.delete_user_profile();
      
      if ('Ok' in result) {
        // Logout after account deletion
        await logout();
        setUserProfile(null);
        setError(null);
      } else if ('Err' in result) {
        if (typeof result.Err === 'object') {
          const errorType = Object.keys(result.Err)[0];
          setError(`Failed to delete profile: ${errorType}`);
        } else {
          setError(`Failed to delete profile: ${String(result.Err)}`);
        }
      } else {
        setError('Failed to delete profile: Unknown error');
      }
    } catch (err) {
      console.error('Error deleting user profile:', err);
      setError(`Failed to delete profile: ${err.message || 'Unknown error'}`);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (!isAuthenticated) {
      return <Login onLogin={login} error={error} />;
    }

    if (!userProfile) {
      return (
        <UserProfile 
          onSubmit={createUserProfile} 
          error={error} 
          isCreating={true}
        />
      );
    }

    switch (view) {
      case 'properties':
        return (
          <PropertyList 
            properties={properties} 
            onSelectProperty={(property) => {
              setSelectedProperty(property);
              setView('propertyDetails');
            }}
          />
        );
      case 'createProperty':
        return (
          <PropertyForm 
            onSubmit={createProperty} 
            error={error} 
          />
        );
      case 'propertyDetails':
        return (
          <PropertyDetails 
            property={selectedProperty} 
            userProfile={userProfile}
            onBack={() => {
              setSelectedProperty(null);
              setView('properties');
            }}
          />
        );
      case 'profile':
        return (
          <UserProfile 
            userProfile={userProfile} 
            onSubmit={createUserProfile} 
            onDelete={deleteUserProfile}
            error={error} 
            isCreating={!userProfile}
          />
        );
      default:
        return <div>Unknown view</div>;
    }
  };

  return (
    <div className="app">
      {isAuthenticated && (
        <Navigation 
          userProfile={userProfile}
          view={view}
          setView={setView}
          onLogout={logout}
        />
      )}
      
      <main>
        {error && <div className="error-message">{error}</div>}
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
