use ic_cdk::{query, update, caller};
use candid::Principal;
use crate::models::{RentalAgreement, AgreementStatus, PropertyStatus, Error, Result};
use crate::storage::{AGREEMENTS, PROPERTIES, now, generate_id};
use crate::property::update_property_status;

// Rental agreement functions
#[update]
pub fn create_rental_agreement(
    property_id: u64,
    tenant: Principal,
    start_date: u64,
    end_date: u64,
    monthly_rent: u64,
    deposit: u64,
) -> Result<RentalAgreement> {
    let caller_principal = caller();
    
    // Verify property exists and is available
    let property = PROPERTIES.with(|properties| {
        match properties.borrow().get(&property_id) {
            Some(prop) => {
                if prop.status != PropertyStatus::Available {
                    return Err(Error::PropertyNotAvailable);
                }
                Ok(prop.clone())
            },
            None => Err(Error::NotFound),
        }
    })?;
    
    // Verify caller is the property owner
    if property.owner != caller_principal {
        return Err(Error::Unauthorized);
    }
    
    let id = generate_id();
    let current_time = now();
    
    let agreement = RentalAgreement {
        id,
        property_id,
        landlord: caller_principal,
        tenant,
        start_date,
        end_date,
        monthly_rent,
        deposit,
        status: AgreementStatus::Pending,
        created_at: current_time,
        updated_at: current_time,
    };
    
    AGREEMENTS.with(|agreements| {
        agreements.borrow_mut().insert(id, agreement.clone());
    });
    
    // Update property status
    update_property_status(property_id, PropertyStatus::Reserved)?;
    
    Ok(agreement)
}

#[query]
pub fn get_agreement(id: u64) -> Result<RentalAgreement> {
    AGREEMENTS.with(|agreements| {
        match agreements.borrow().get(&id) {
            Some(agreement) => Ok(agreement.clone()),
            None => Err(Error::NotFound),
        }
    })
}

#[query]
pub fn get_user_agreements(user_principal: Principal) -> Vec<RentalAgreement> {
    AGREEMENTS.with(|agreements| {
        agreements.borrow().iter()
            .filter(|(_, agreement)| {
                agreement.landlord == user_principal || agreement.tenant == user_principal
            })
            .map(|(_, agreement)| agreement.clone())
            .collect()
    })
}

#[update]
pub fn update_agreement_status(agreement_id: u64, new_status: AgreementStatus) -> Result<RentalAgreement> {
    let caller_principal = caller();
    
    AGREEMENTS.with(|agreements| {
        let mut agreements_map = agreements.borrow_mut();
        match agreements_map.get(&agreement_id) {
            Some(agreement) => {
                // Verify caller is either landlord or tenant
                if agreement.landlord != caller_principal && agreement.tenant != caller_principal {
                    return Err(Error::Unauthorized);
                }
                
                let updated_agreement = RentalAgreement {
                    status: new_status.clone(),
                    updated_at: now(),
                    ..agreement.clone()
                };
                
                agreements_map.insert(agreement_id, updated_agreement.clone());
                
                // Update property status based on agreement status
                let property_status = match new_status {
                    AgreementStatus::Active => PropertyStatus::Rented,
                    AgreementStatus::Completed | AgreementStatus::Cancelled => PropertyStatus::Available,
                    _ => return Ok(updated_agreement),
                };
                
                let _ = update_property_status(agreement.property_id, property_status);
                
                Ok(updated_agreement)
            },
            None => Err(Error::NotFound),
        }
    })
} 