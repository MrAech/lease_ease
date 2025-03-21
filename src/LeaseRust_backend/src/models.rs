use candid::{CandidType, Deserialize, Principal};
use ic_stable_structures::Storable;
use ic_stable_structures::storable::Bound;
use serde::Serialize;
use std::borrow::Cow;
use std::hash::{Hash, Hasher};

// Principal wrapper type that we can implement Storable for
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct StablePrincipal(pub Principal);

impl From<Principal> for StablePrincipal {
    fn from(principal: Principal) -> Self {
        StablePrincipal(principal)
    }
}

impl From<StablePrincipal> for Principal {
    fn from(stable_principal: StablePrincipal) -> Self {
        stable_principal.0
    }
}

// Implement Hash trait
impl Hash for StablePrincipal {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.0.as_slice().hash(state);
    }
}

// Manually implement PartialEq
impl PartialEq for StablePrincipal {
    fn eq(&self, other: &Self) -> bool {
        self.0.as_slice() == other.0.as_slice()
    }
}

// Manually implement Eq
impl Eq for StablePrincipal {}

// Manually implement PartialOrd
impl PartialOrd for StablePrincipal {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

// Manually implement Ord
impl Ord for StablePrincipal {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        self.0.as_slice().cmp(other.0.as_slice())
    }
}

// Implement Storable trait for StablePrincipal
impl Storable for StablePrincipal {
    const BOUND: Bound = Bound::Bounded {
        max_size: 29, // Principal is at most 29 bytes
        is_fixed_size: false,
    };

    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(self.0.as_slice().to_vec())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        StablePrincipal(Principal::from_slice(&bytes))
    }
}

// Define property types
#[derive(CandidType, Deserialize, Serialize, Clone, Debug, PartialEq, Eq)]
pub enum PropertyType {
    Apartment,
    House,
    Commercial,
    Land,
}

// Define property status
#[derive(CandidType, Deserialize, Serialize, Clone, Debug, PartialEq, Eq)]
pub enum PropertyStatus {
    Available,
    Rented,
    Maintenance,
    Reserved,
}

// Define user roles
#[derive(CandidType, Deserialize, Serialize, Clone, Debug, PartialEq, Eq)]
pub enum UserRole {
    Landlord,
    Tenant,
    // Admin role removed
    // Admin role removed

}

// Define rental agreement status
#[derive(CandidType, Deserialize, Serialize, Clone, Debug, PartialEq, Eq)]
pub enum AgreementStatus {
    Pending,
    Active,
    Completed,
    Cancelled,
    Disputed,
}

// Define property structure
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct Property {
    pub id: u64,
    pub owner: Principal,
    pub title: String,
    pub description: String,
    pub property_type: PropertyType,
    pub price: u64,
    pub deposit: u64,
    pub status: PropertyStatus,
    pub location: String,
    pub amenities: Vec<String>,
    pub images: Vec<String>,
    pub created_at: u64,
    pub updated_at: u64,
}

// Define user profile structure
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct UserProfile {
    pub user_principal: Principal,
    pub role: UserRole,
    pub name: String,
    pub email: String,
    pub phone: String,
    pub is_kyc_verified: bool,
    pub created_at: u64,
    pub updated_at: u64,
}

// Define rental agreement structure
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct RentalAgreement {
    pub id: u64,
    pub property_id: u64,
    pub landlord: Principal,
    pub tenant: Principal,
    pub start_date: u64,
    pub end_date: u64,
    pub monthly_rent: u64,
    pub deposit: u64,
    pub status: AgreementStatus,
    pub created_at: u64,
    pub updated_at: u64,
}

// Define result type for error handling
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub enum Error {
    NotFound,
    AlreadyExists,
    Unauthorized,
    InvalidInput,
    PropertyNotAvailable,
}

pub type Result<T> = std::result::Result<T, Error>;

// Implement Storable trait for Property
impl Storable for Property {
    const BOUND: Bound = Bound::Bounded {
        max_size: 1024 * 10, // 10KB should be enough for a property
        is_fixed_size: false,
    };
    
    fn to_bytes(&self) -> Cow<[u8]> {
        let bytes = candid::encode_one(self).unwrap();
        Cow::Owned(bytes)
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
}

// Implement Storable trait for RentalAgreement
impl Storable for RentalAgreement {
    const BOUND: Bound = Bound::Bounded {
        max_size: 1024 * 5, // 5KB should be enough for an agreement
        is_fixed_size: false,
    };
    
    fn to_bytes(&self) -> Cow<[u8]> {
        let bytes = candid::encode_one(self).unwrap();
        Cow::Owned(bytes)
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
}

// Implement Storable trait for UserProfile
impl Storable for UserProfile {
    const BOUND: Bound = Bound::Bounded {
        max_size: 1024 * 2, // 2KB should be enough for a user profile
        is_fixed_size: false,
    };
    
    fn to_bytes(&self) -> Cow<[u8]> {
        let bytes = candid::encode_one(self).unwrap();
        Cow::Owned(bytes)
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
}
