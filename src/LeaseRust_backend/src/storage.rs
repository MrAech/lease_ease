use std::cell::RefCell;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::StableBTreeMap;
use ic_stable_structures::DefaultMemoryImpl;
use ic_cdk::api::time;
use crate::models::{Property, UserProfile, RentalAgreement, StablePrincipal};

// Type aliases
pub type Memory = VirtualMemory<DefaultMemoryImpl>;
pub type IdCounter = ic_stable_structures::cell::Cell<u64, Memory>;

// Define thread-local storage for our data
thread_local! {
    pub static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    pub static ID_COUNTER: RefCell<IdCounter> = RefCell::new(
        IdCounter::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
            0
        ).unwrap()
    );

    pub static PROPERTIES: RefCell<StableBTreeMap<u64, Property, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))
        )
    );

    pub static USERS: RefCell<StableBTreeMap<StablePrincipal, UserProfile, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3)))
        )
    );
    
    pub static AGREEMENTS: RefCell<StableBTreeMap<u64, RentalAgreement, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2)))
        )
    );
}

// Helper function to get the current timestamp
pub fn now() -> u64 {
    // Convert nanoseconds to seconds
    time() / 1_000_000_000
}

// Helper function to generate a new ID
pub fn generate_id() -> u64 {
    ID_COUNTER.with(|counter| {
        let mut counter_ref = counter.borrow_mut();
        let current_id = counter_ref.get();
        let next_id = current_id + 1;
        counter_ref.set(next_id).expect("Failed to update ID counter");
        next_id
    })
} 