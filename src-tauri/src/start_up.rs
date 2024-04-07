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

    let device_manager = DeviceManager::from_storage(&storage_manager).unwrap_or_default();
    device_manager.to_storage(&storage_manager).unwrap();

    let profile_manager = ProfileManager::from_storage(&storage_manager).unwrap_or_default();
    profile_manager.to_storage(&storage_manager).unwrap();

    let t_e = (Instant::now() - t_s).as_micros();
    info!("Start up procedure complete. Start up time: {t_e} μs");

    ApplicationStateBuilder::new()
        .with_device_manager(device_manager)
        .with_storage_manager(storage_manager)
        .with_profile_manager(profile_manager)
        .build()
}
