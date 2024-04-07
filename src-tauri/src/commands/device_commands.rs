use tauri::async_runtime::RwLock;

use super::CommandError;
use crate::{
    device::{Device, DeviceId},
    state::ApplicationState,
    storage_manager::Store,
};

#[tauri::command]
#[specta::specta]
pub(crate) async fn get_connected_devices(
    state: tauri::State<'_, RwLock<ApplicationState>>,
) -> Result<Vec<Device>, CommandError> {
    let guard = state.read().await;
    let devices = guard
        .get_device_manager()
        .get_devices()
        .into_iter()
        .map(|device| device.clone())
        .collect();

    Ok(devices)
}

#[tauri::command]
#[specta::specta]
pub(crate) async fn delete_device(
    state: tauri::State<'_, RwLock<ApplicationState>>,
    device_id: DeviceId,
) -> Result<(), CommandError> {
    let mut guard = state.write().await;

    guard.get_profile_manager_mut().delete_device(&device_id)?;
    guard.get_device_manager_mut().delete_device(&device_id)?;

    guard
        .get_profile_manager()
        .to_storage(&guard.get_storage_manager())
        .map_err(|e| CommandError::StorageManagerError {
            message: e.to_string(),
        })?;

    guard
        .get_profile_manager()
        .to_storage(&guard.get_storage_manager())
        .map_err(|e| CommandError::StorageManagerError {
            message: e.to_string(),
        })?;

    Ok(())
}
