use std::collections::hash_map::HashMap;

use serde::{Deserialize, Serialize};
use specta::Type;
use thiserror::Error;
use tracing::{error, instrument, warn};

use crate::storage_manager::{StorageManager, StorageManagerError, Store};

use super::{Device, DeviceId};

#[derive(Debug, Error, Serialize, Deserialize, Type)]
pub(crate) enum DeviceManagerError {
    #[error("DeviceNotFound: DeviceId {0}")]
    DeviceNotFound(DeviceId),

    #[error("DeviceAlreadyRegistered: DeviceId {0}")]
    DeviceAlreadyRegistered(DeviceId),
}

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
#[cfg_attr(test, derive(PartialEq))]
pub(crate) struct DeviceManager {
    devices: HashMap<DeviceId, Device>,
}

impl DeviceManager {
    pub(crate) fn new(known_devices: HashMap<DeviceId, Device>) -> Self {
        Self {
            devices: known_devices,
        }
    }

    pub(crate) fn get_device(&self, device_id: &DeviceId) -> Result<&Device, DeviceManagerError> {
        self.devices
            .get(device_id)
            .ok_or_else(|| DeviceManagerError::DeviceNotFound(device_id.clone()))
    }

    pub(crate) fn get_device_mut(
        &mut self,
        device_id: &DeviceId,
    ) -> Result<&mut Device, DeviceManagerError> {
        self.devices
            .get_mut(device_id)
            .ok_or_else(|| DeviceManagerError::DeviceNotFound(device_id.clone()))
    }

    pub(crate) fn get_devices(&self) -> Vec<&Device> {
        self.devices.values().collect()
    }

    pub(crate) fn insert_device(
        &mut self,
        device_id: &DeviceId,
        device: Device,
    ) -> Result<(), DeviceManagerError> {
        self.devices
            .insert(device_id.to_string(), device)
            .map_or_else(
                || Ok(()), 
                |_| Err(DeviceManagerError::DeviceAlreadyRegistered(device_id.to_string()))
            )
    }

    pub(crate) fn delete_device(&mut self, device_id: &DeviceId) -> Result<(), DeviceManagerError> {
        self.devices
            .remove(device_id)
            .map(|_| ())
            .ok_or_else(|| DeviceManagerError::DeviceNotFound(device_id.clone()))
    }

    pub(crate) fn replace_devices(&mut self, devices: HashMap<DeviceId, Device>) {
        self.devices = devices;
    }
}

impl Store for DeviceManager {
    fn storage_path() -> &'static str {
        "device.json"
    }

    #[instrument(skip_all)]
    fn from_storage(storage_manager: &StorageManager) -> Result<Self, StorageManagerError> {
        let dm = storage_manager.read_from_storage::<DeviceManager>(Self::storage_path());

        if let Err(StorageManagerError::CorruptionError(_)) = dm {
            warn!("Corrupted device configuration file. Attempting to delete the file.");
            storage_manager
                .delete_from_storage(Self::storage_path())
                .or_else(|e| {
                    error!(e=%e, "Encountered a non-derializable file at {}. Unable to delete the file.", Self::storage_path());
                    Err(e)
                })?;
        }
        dm
    }

    #[instrument(skip(storage_manager))]
    fn to_storage(&self, storage_manager: &StorageManager) -> Result<(), StorageManagerError> {
        let ser = serde_json::to_string(self)?;
        storage_manager.write_to_storage(Self::storage_path(), ser)
    }
}
