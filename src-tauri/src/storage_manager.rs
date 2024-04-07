use bytes::Bytes;
use directories::BaseDirs;
use serde::de::DeserializeOwned;
use std::{fs, io};

use thiserror::Error;
use tracing::{error, info, instrument};

pub(crate) trait Store {
    fn storage_path() -> &'static str;

    fn from_storage(storage_manager: &StorageManager) -> Result<Self, StorageManagerError>
    where
        Self: Sized;

    fn to_storage(&self, storage_manager: &StorageManager) -> Result<(), StorageManagerError>;
}

#[derive(Debug, Error)]
pub(crate) enum StorageManagerError {
    #[error("IO error: {0}")]
    IOError(#[from] io::Error),

    #[error("Corruption error: {0}")]
    CorruptionError(#[from] serde_json::Error),

    #[error("Conversion error: {0}")]
    ConversionError(#[from] anyhow::Error),
}

#[cfg_attr(any(test, debug_assertions), allow(dead_code))]
#[derive(Debug)]
pub(crate) struct StorageManager {
    base_dirs: BaseDirs,
}

impl StorageManager {
    pub(crate) fn new() -> Self {
        Self {
            base_dirs: BaseDirs::new().unwrap(),
        }
    }

    #[cfg(test)]
    pub(crate) fn get_storage_dir_path(&self) -> std::path::PathBuf {
        std::env::current_dir().unwrap().join("crabby")
    }

    #[cfg(not(test))]
    pub(crate) fn get_storage_dir_path(&self) -> std::path::PathBuf {
        return self.base_dirs.data_local_dir().join("crabby");
    }

    #[instrument]
    pub(crate) fn read_from_storage<T: DeserializeOwned>(
        &self,
        filename: &str,
    ) -> Result<T, StorageManagerError> {
        let path = self.get_storage_dir_path().join(filename);
        let file = fs::read_to_string(&path).map_err(|e| {
            let path_str_rep = path.to_str();
            info!(e=%e, "Could not read file at path: {path_str_rep:?}");
            e
        })?;

        let out = serde_json::from_str::<T>(&file).map_err(|e| {
            error!(e=%e, "Could not covert bytes to struct.");
            e
        })?;
        Ok(out)
    }

    #[instrument(skip(buffer))]
    pub(crate) fn write_to_storage(
        &self,
        filename: &str,
        buffer: impl TryInto<Bytes>,
    ) -> Result<(), StorageManagerError> {
        let path = self.get_storage_dir_path().join(filename);
        let buffer: Bytes = buffer.try_into().map_err(|_| {
            error!("Could not convert buffer to &[u8].");
            StorageManagerError::ConversionError(anyhow::anyhow!(
                "Could not write save data to local storage."
            ))
        })?;

        fs::write(path, buffer)?;
        Ok(())
    }

    pub(crate) fn delete_from_storage(&self, filename: &str) -> Result<(), StorageManagerError> {
        let path = self.get_storage_dir_path().join(filename);
        fs::remove_file(path)?;
        Ok(())
    }

    fn delete_storage(&self) -> Result<(), StorageManagerError> {
        let path = self.get_storage_dir_path();
        fs::remove_dir_all(path)?;
        Ok(())
    }

    #[instrument]
    pub(crate) fn initailize_storage_directory(&self) -> Result<(), StorageManagerError> {
        let path = self.get_storage_dir_path();
        match path.try_exists() {
            Ok(true) => Ok(()),
            Ok(false) => {
                fs::create_dir(path).map_err(|e| {
                    error!(e=%e, "Could not initialize directory.");
                    e
                })?;
                Ok(())
            }
            Err(e) => {
                error!(e=%e, "Could not determine if application's data storage directory exists.");
                Err(e.into())
            }
        }
    }
}

impl Default for StorageManager {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use crate::device::{
        device_manager::DeviceManager, keyboard::Keyboard, mouse::Mouse, Device, DeviceId,
        DeviceModel, DeviceType,
    };

    use super::StorageManager;
    use std::collections::hash_map::HashMap;
    use tracing::info;

    macro_rules! devices {
        () => {{
            let device_one = Device::builder()
                .with_id("d069ed5e-3f58-421d-8ab1-b50ea21846e3".to_string())
                .with_model(DeviceModel::M1)
                .with_device_type(DeviceType::Mouse(Mouse { dpi: 800 }))
                .with_active_profile("asd".to_string())
                .build();

            let device_two = Device::builder()
                .with_id("6693616e-76c6-41e6-853f-0e5db1d2857f".to_string())
                .with_model(DeviceModel::K1)
                .with_device_type(DeviceType::Keyboard(Keyboard {}))
                .with_active_profile("dsa".to_string())
                .build();
            [
                (device_one.get_id().to_string(), device_one),
                (device_two.get_id().to_string(), device_two),
            ]
            .iter()
            .cloned()
            .collect::<HashMap<DeviceId, Device>>()
        }};
    }

    #[test]
    fn can_create_and_delete_storage_dir() {
        let sm = StorageManager::new();
        info!("{:?}", sm.get_storage_dir_path());

        // creates
        assert!(sm.initailize_storage_directory().is_ok());
        // already exists so does nothing
        assert!(sm.initailize_storage_directory().is_ok());

        // check delete
        assert!(sm.delete_storage().is_ok());

        // delete fails when storage does not exist
        assert!(sm.delete_storage().is_err());
    }

    #[test]
    fn can_read_write_struct() {
        let config = DeviceManager::new(devices!());
        let sm = StorageManager::new();

        sm.initailize_storage_directory().unwrap();

        // serialization is tested elsewhere
        let serialized = serde_json::to_string(&config).unwrap();

        // Roundtrip
        // can write to file
        assert!(sm.write_to_storage("devices.json", serialized).is_ok());
        // can read from file and deserialize
        let deserialized = sm.read_from_storage::<DeviceManager>("devices.json");
        assert!(deserialized.is_ok());
        assert_eq!(deserialized.unwrap(), config);
    }

    #[test]
    fn can_overwrite_file() {
        let config_one = DeviceManager::default();
        let config_two = DeviceManager::new(devices!());
        let sm = StorageManager::new();

        assert!(sm.initailize_storage_directory().is_ok());

        // can overwrite
        let serialized_one = serde_json::to_string(&config_one).unwrap();
        println!("{serialized_one}");
        assert!(sm.write_to_storage("devices.json", serialized_one).is_ok());

        let deserialized_one = sm.read_from_storage::<DeviceManager>("devices.json");
        println!("Deserialized: {deserialized_one:#?}");
        assert!(deserialized_one.is_ok());

        let deserialized_one = deserialized_one.unwrap();
        assert_eq!(deserialized_one, config_one);

        let serialized_two = serde_json::to_string(&config_two).unwrap();
        println!("{serialized_two}");
        assert!(sm.write_to_storage("devices.json", serialized_two).is_ok());

        let deserialized_two = sm.read_from_storage::<DeviceManager>("devices.json");
        println!("Deserialized: {deserialized_two:#?}");
        assert!(deserialized_two.is_ok());

        let deserialized_two = deserialized_two.unwrap();
        assert_eq!(deserialized_two, config_two);

        assert_ne!(deserialized_two, deserialized_one);
    }

    #[test]
    fn can_delete_file() {
        let config = DeviceManager::default();
        let sm = StorageManager::new();

        sm.initailize_storage_directory().unwrap();

        // can delete file
        let serialized = serde_json::to_string(&config).unwrap();
        assert!(sm.write_to_storage("devices.json", serialized).is_ok());
        assert!(sm.delete_from_storage("devices.json").is_ok());
    }
}
