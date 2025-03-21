import { useState } from "react";
import Login from "./Login";
import NamePrompt from "./NamePrompt";
import PropertyList from "./PropertyList";
import PropertyForm from "./PropertyForm";
import PropertyDetails from "./PropertyDetails";
import UserProfile from "./UserProfile";
import { useAuth } from "../StateManagement/useContext/useClient";

const PropertyManagement = () => {
  const [view, setView] = useState("properties");
   const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
  const { isAuthenticated, principal,actor } = useAuth();
   const [error, setError] = useState(null);
  const fetchProperties = async () => {
    try {
      const propertiesResult = await actor.get_all_properties();
      setProperties(propertiesResult);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to fetch properties. Please try again.');
    }
  };

  const createProperty = async (propertyData) => {
    try {
      const result = await actor.create_property(
        propertyData.title,
        propertyData.description,
        propertyData.propertyType,
        propertyData.price.toString(),
        propertyData.deposit.toString(),
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
      
        const result = await actor.create_user_profile(
          profileData.role, // Ensure role is included
          profileData.name,
          profileData.email,
          profileData.phone
        );
        setView('properties'); // Redirect to properties view after profile creation


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
      const result = await actor.delete_user_profile();
      
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
   

    if (!isAuthenticated) {
      return <Login />;
    }

    if (!userProfile) {
      return <NamePrompt onSubmit={createUserProfile} error={error} />;
    }

    switch (view) {
      case "properties":
        return (
          <PropertyList
            properties={properties}
            onSelectProperty={(property) => {
              setSelectedProperty(property);
              setView("propertyDetails");
            }}
          />
        );
      case "createProperty":
        return <PropertyForm onSubmit={createProperty} error={error} />;
      case "propertyDetails":
        return (
          <PropertyDetails
            property={selectedProperty}
            userProfile={userProfile}
            onBack={() => {
              setSelectedProperty(null);
              setView("properties");
            }}
          />
        );
      case "profile":
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

  return <div>{renderContent()}</div>;
};

export default PropertyManagement;
