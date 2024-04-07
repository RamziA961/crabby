use tauri::async_runtime::RwLock;

use super::CommandError;
use crate::{
    device::DeviceId,
    profile::{
        profile_manager::{ProfileManagerError, ProfileTetrad},
        Profile, ProfileId,
    },
    state::ApplicationState,
    storage_manager::Store,
};

#[tauri::command]
#[specta::specta]
pub(crate) async fn get_device_profile_ids(
    state: tauri::State<'_, RwLock<ApplicationState>>,
    device_id: String,
) -> Result<ProfileTetrad, CommandError> {
    let guard = state.read().await;
    let profiles = guard
        .get_profile_manager()
        .get_device_profile_ids(&device_id)?;
    Ok(profiles.clone())
}

#[tauri::command]
#[specta::specta]
pub(crate) async fn get_active_profile(
    state: tauri::State<'_, RwLock<ApplicationState>>,
    device_id: DeviceId,
) -> Result<Profile, CommandError> {
    let guard = state.read().await;
    let device = guard.get_device_manager().get_device(&device_id)?;
    let profile_id = device.get_active_profile();
    let profile = guard.get_profile_manager().get_profile(&profile_id)?;
    Ok(profile.clone())
}

#[tauri::command]
#[specta::specta]
pub(crate) async fn get_profile(
    state: tauri::State<'_, RwLock<ApplicationState>>,
    profile_id: ProfileId,
) -> Result<Profile, CommandError> {
    let guard = state.read().await;
    let profile = guard.get_profile_manager().get_profile(&profile_id)?;
    Ok(profile.clone())
}

#[tauri::command]
#[specta::specta]
pub(crate) async fn insert_profile(
    state: tauri::State<'_, RwLock<ApplicationState>>,
    device_id: DeviceId,
    profile: Profile,
) -> Result<(), CommandError> {
    let mut guard = state.write().await;
    guard
        .get_profile_manager_mut()
        .insert_profile(&device_id, profile)?;

    guard
        .get_profile_manager()
        .to_storage(&guard.get_storage_manager())
        .map_err(|e| CommandError::StorageManagerError {
            message: e.to_string(),
        })?;

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub(crate) async fn overwrite_profile(
    state: tauri::State<'_, RwLock<ApplicationState>>,
    device_id: DeviceId,
    profile_id: ProfileId,
    profile: Profile,
) -> Result<(), CommandError> {
    let mut guard = state.write().await;
    guard
        .get_profile_manager_mut()
        .overwrite_profile(&device_id, &profile_id, profile)?;
    guard
        .get_profile_manager()
        .to_storage(&guard.get_storage_manager())
        .map_err(|e| CommandError::StorageManagerError {
            message: e.to_string(),
        })?;
    Ok(())
}

#[tauri::command]
#[specta::specta]
pub(crate) async fn delete_profile(
    state: tauri::State<'_, RwLock<ApplicationState>>,
    device_id: DeviceId,
    profile_id: ProfileId,
) -> Result<(), CommandError> {
    let mut guard = state.write().await;
    guard
        .get_profile_manager_mut()
        .delete_profile(&device_id, &profile_id)?;

    let active_profile = guard
        .get_device_manager()
        .get_device(&device_id)
        .unwrap()
        .get_active_profile();

    if *active_profile == profile_id {
        let profile_id = guard
            .get_profile_manager()
            .get_device_first_available_profile(&device_id);

        let profile_id = match profile_id {
            Err(ProfileManagerError::EmptyProfileSlots(_)) => {
                let device_model = guard
                    .get_device_manager()
                    .get_device(&device_id)
                    .unwrap()
                    .get_model()
                    .clone();

                let id = guard
                    .get_profile_manager_mut()
                    .insert_device_default_profile(&device_id, &device_model)
                    .unwrap();
                Ok(id)
            }
            Ok(profile_id) => Ok(profile_id),
            Err(e) => Err(e),
        }?;

        guard
            .get_device_manager_mut()
            .get_device_mut(&device_id)
            .unwrap()
            .set_active_profile(profile_id.to_string());

        guard
            .get_device_manager()
            .to_storage(&guard.get_storage_manager())
            .map_err(|e| CommandError::StorageManagerError {
                message: e.to_string(),
            })?;
    }

    guard
        .get_profile_manager()
        .to_storage(&guard.get_storage_manager())
        .map_err(|e| CommandError::StorageManagerError {
            message: e.to_string(),
        })?;

    Ok(())
}
