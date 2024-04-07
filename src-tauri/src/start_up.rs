use core::panic;
use std::time::Instant;
use tracing::{error, info, instrument};

use crate::{
    device::device_manager::DeviceManager,
    profile::profile_manager::ProfileManager,
    state::{ApplicationState, ApplicationStateBuilder},
    storage_manager::{StorageManager, Store},
};

#[instrument]
pub(crate) fn run() -> ApplicationState {
    info!("Start up procedure started");
    let t_s = Instant::now();
    let storage_manager = StorageManager::new();

    storage_manager
        .initailize_storage_directory()
        .map_err(|e| {
            error!(e=%e, "Start up failure. Could not initialize local storage direcory.");
            panic!("FATAL ERROR: Start up failure. Could not create local storage directory.");
        })
        .unwrap();

    #[cfg(debug_assertions)]
    let (device_manager, profile_manager) = debug_manager_creation(&storage_manager);

    #[cfg(not(debug_assertions))]
    let (device_manager, profile_manager) = (
        DeviceManager::from_storage(&storage_manager).unwrap_or_default(),
        ProfileManager::from_storage(&storage_manager).unwrap_or_default()
    );

    device_manager.to_storage(&storage_manager).unwrap();
    profile_manager.to_storage(&storage_manager).unwrap();


    let t_e = (Instant::now() - t_s).as_micros();
    info!("Start up procedure complete. Start up time: {t_e} μs");

    ApplicationStateBuilder::new()
        .with_device_manager(device_manager)
        .with_storage_manager(storage_manager)
        .with_profile_manager(profile_manager)
        .build()
}


#[cfg(debug_assertions)]
fn debug_manager_creation(storage_manager: &StorageManager) -> (DeviceManager, ProfileManager){
    use crate::device::{mouse::Mouse, Device, DeviceModel, DeviceType};
    let mut device_manager = DeviceManager::from_storage(&storage_manager).unwrap_or_default();
    let mut profile_manager = ProfileManager::from_storage(&storage_manager).unwrap_or_default();

    let mut device_one = Device::builder()
        .with_device_type(DeviceType::Mouse(Mouse { dpi: 800 }))
        .with_model(DeviceModel::M1);

    let id = profile_manager
        .register_device(
            device_one.get_id(), 
            device_one.get_model().clone().unwrap()
        )
        .unwrap();

    device_one = device_one.with_active_profile(id);

    let id = device_one.get_id().clone();
    device_manager.insert_device(&id, device_one.build())
        .unwrap();
    (device_manager, profile_manager)
}

