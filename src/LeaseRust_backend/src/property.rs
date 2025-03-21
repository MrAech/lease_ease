use ic_cdk::{query, update, caller};
use candid::Principal;
use crate::models::{Property, PropertyType, PropertyStatus, UserRole, Error, Result, StablePrincipal};
use crate::storage::{PROPERTIES, USERS, now, generate_id};

// Property management functions
#[update]
pub fn create_property(
    title: String,
    description: String,
    property_type: PropertyType,
    price: u64,
    deposit: u64,
    location: String,
    amenities: Vec<String>,
    images: Vec<String>,
) -> Result<Property> {
    let caller_principal = caller();
    
    // Verify caller is a landlord
    USERS.with(|users| {
        match users.borrow().get(&StablePrincipal(caller_principal)) {
            Some(profile) => {
                match profile.role {
                    UserRole::Landlord | UserRole::Admin => Ok(()),
                    _ => return Err(Error::Unauthorized),
                }
            },
            None => return Err(Error::Unauthorized),
        }
    })?;
    
    let id = generate_id();
    let current_time = now();
    
    let property = Property {
        id,
        owner: caller_principal,
        title,
        description,
        property_type,
        price,
        deposit,
        status: PropertyStatus::Available,
        location,
        amenities,
        images,
        created_at: current_time,
        updated_at: current_time,
    };
    
    PROPERTIES.with(|properties| {
        properties.borrow_mut().insert(id, property.clone());
    });
    
    Ok(property)
}

#[query]
pub fn get_property(id: u64) -> Result<Property> {
    PROPERTIES.with(|properties| {
        match properties.borrow().get(&id) {
            Some(property) => Ok(property.clone()),
            None => Err(Error::NotFound),
        }
    })
}

#[query]
pub fn get_all_properties() -> Vec<Property> {
    PROPERTIES.with(|properties| {
        properties.borrow().iter().map(|(_, property)| property.clone()).collect()
    })
}

#[update]
pub fn update_property_status(property_id: u64, new_status: PropertyStatus) -> Result<Property> {
    let caller_principal = caller();
    
    PROPERTIES.with(|properties| {
        let mut properties_map = properties.borrow_mut();
        match properties_map.get(&property_id) {
            Some(property) => {
                if property.owner != caller_principal {
                    return Err(Error::Unauthorized);
                }
                
                let updated_property = Property {
                    status: new_status,
                    updated_at: now(),
                    ..property.clone()
                };
                
                properties_map.insert(property_id, updated_property.clone());
                Ok(updated_property)
            },
            None => Err(Error::NotFound),
        }
    })
} 