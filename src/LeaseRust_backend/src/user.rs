use ic_cdk::{query, update, caller};
use candid::Principal;
use crate::models::{UserProfile, UserRole, Error, Result, StablePrincipal};
use crate::storage::{USERS, now};

// User management functions
#[update]
pub fn create_user_profile(role: UserRole, name: String, email: String, phone: String) -> Result<UserProfile> {
    let caller_principal = caller();
    ic_cdk::println!("Creating user profile for principal: {:?}", caller_principal);
    ic_cdk::println!("Role: {:?}, Name: {}, Email: {}, Phone: {}", role, name, email, phone);
    
    USERS.with(|users| {
        if users.borrow().contains_key(&StablePrincipal(caller_principal)) {
            ic_cdk::println!("User already exists");
            return Err(Error::AlreadyExists);
        }
        
        let current_time = now();
        ic_cdk::println!("Current time: {}", current_time);
        
        let profile = UserProfile {
            user_principal: caller_principal,
            role,
            name,
            email,
            phone,
            is_kyc_verified: false,
            created_at: current_time,
            updated_at: current_time,
        };
        
        ic_cdk::println!("Inserting user profile");
        users.borrow_mut().insert(StablePrincipal(caller_principal), profile.clone());
        ic_cdk::println!("User profile created successfully");
        Ok(profile)
    })
}

#[query]
pub fn get_user_profile(principal: Principal) -> Result<UserProfile> {
    USERS.with(|users| {
        match users.borrow().get(&StablePrincipal(principal)) {
            Some(profile) => Ok(profile.clone()),
            None => Err(Error::NotFound),
        }
    })
}

#[update]
pub fn delete_user_profile() -> Result<()> {
    let caller_principal = caller();
    ic_cdk::println!("Deleting user profile for principal: {:?}", caller_principal);
    
    USERS.with(|users| {
        if !users.borrow().contains_key(&StablePrincipal(caller_principal)) {
            return Err(Error::NotFound);
        }
        
        users.borrow_mut().remove(&StablePrincipal(caller_principal));
        ic_cdk::println!("User profile deleted successfully");
        Ok(())
    })
} 