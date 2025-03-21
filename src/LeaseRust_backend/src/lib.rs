// Import necessary types for Candid export
use candid::Principal;
use crate::models::{PropertyType, PropertyStatus, UserRole, AgreementStatus};

// Define the modules   
pub mod models;
pub mod storage;
pub mod user;
pub mod property;
pub mod agreement;

// Re-export the public functions for Candid interface
pub use user::{create_user_profile, get_user_profile, delete_user_profile};
pub use property::{create_property, get_property, get_all_properties, update_property_status};
pub use agreement::{create_rental_agreement, get_agreement, get_user_agreements, update_agreement_status};

// Need to include these for candid generation
pub use models::{Property, UserProfile, RentalAgreement, Error, Result};

// Expose Candid interface
ic_cdk::export_candid!();
