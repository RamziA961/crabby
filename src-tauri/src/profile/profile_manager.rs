use serde::{Deserialize, Serialize};
use specta::Type;
use std::collections::HashMap;
use thiserror::Error;
use tracing::{error, instrument, warn};

use super::{default_profile_provider::DefaultProfileProvider, Profile, ProfileId};
use crate::{
    device::{DeviceId, DeviceModel},
    storage_manager::{StorageManager, StorageManagerError, Store},
};

pub(crate) type ProfileTetrad = [Option<ProfileId>; 4];

#[derive(Debug, Error, Serialize, Deserialize, Type)]
pub(crate) enum ProfileManagerError {
    #[error("DeviceAlreadyRegistered: DeviceId {0} ")]
    DeviceAlreadyRegistered(DeviceId),

    #[error("InsufficientProfileSlots: DeviceId {0}")]
    InsufficientProfileSlots(DeviceId),

    #[error("ProfileNotFound: ProfileId {0}")]
    ProfileNotFound(ProfileId),

    #[error("EmptyProfileSlots: {0}")]
    EmptyProfileSlots(DeviceId),

    #[error("NonEmptyProfileSlots: {0}")]
    NonEmptyProfileSlots(DeviceId),

    #[error("UnknownDevice: DeviceId {0}")]
    UnknownDevice(DeviceId),
}

/// The `ProfileManager` is responsible for managing the association between [`Device`][Device]s and [`Profile`]s,
/// as well as, serialization of the profiles to disk.
///
/// [Device]: crate::device::Device
#[derive(Clone, Debug, Deserialize, Serialize)]
pub(crate) struct ProfileManager {
    device_profile_map: HashMap<DeviceId, ProfileTetrad>,
    profiles: HashMap<ProfileId, Profile>,
}

impl ProfileManager {
    pub fn new(
        device_profile_map: HashMap<DeviceId, ProfileTetrad>,
        profiles: HashMap<ProfileId, Profile>,
    ) -> Self {
        Self {
            device_profile_map,
            profiles,
        }
    }

    /// Register a new device with the `ProfileManager`. This method automatically
    /// associates the [`DeviceModel`] default [`Profile`] with the device and allocates
    /// three additional slots for custom user profiles.The default `Profile` can
    /// eventually be replaced with a custom `Profile`.
    pub fn register_device(
        &mut self,
        device_id: &DeviceId,
        device_model: DeviceModel,
    ) -> Result<(), ProfileManagerError> {
        if !self.device_profile_map.contains_key(device_id) {
            let configuration = DefaultProfileProvider::profile(device_model);
            let profile = Profile::new(device_id, configuration);

            self.device_profile_map.insert(
                device_id.to_string(),
                [Some(profile.id.to_string()), None, None, None],
            );
            self.profiles.insert(profile.id.to_string(), profile);
            Ok(())
        } else {
            Err(ProfileManagerError::DeviceAlreadyRegistered(
                device_id.to_string(),
            ))
        }
    }

    pub fn insert_device_default_profile(
        &mut self,
        device_id: &DeviceId,
        device_model: &DeviceModel,
    ) -> Result<ProfileId, ProfileManagerError> {
        let profile_ids = if let Some(profile_ids) = self.device_profile_map.get(device_id) {
            profile_ids
        } else {
            return Err(ProfileManagerError::UnknownDevice(device_id.to_string()));
        };

        if !profile_ids.iter().all(|v| v.is_none()) {
            return Err(ProfileManagerError::NonEmptyProfileSlots(
                device_id.to_string(),
            ));
        }

        let configuration = DefaultProfileProvider::profile(device_model.clone());
        let profile = Profile::new(device_id, configuration);
        let id = profile.id.to_string();
        let profile_tet = [Some(profile.id.to_string()), None, None, None];

        self.profiles.insert(profile.id.to_string(), profile);
        self.device_profile_map
            .insert(device_id.to_string(), profile_tet);
        Ok(id)
    }

    pub fn get_device_profile_ids(
        &self,
        device_id: &DeviceId,
    ) -> Result<&ProfileTetrad, ProfileManagerError> {
        self.device_profile_map
            .get(device_id)
            .ok_or_else(|| ProfileManagerError::UnknownDevice(device_id.to_string()))
    }

    pub fn get_device_first_available_profile(
        &self,
        device_id: &DeviceId,
    ) -> Result<ProfileId, ProfileManagerError> {
        let mut profile_ids = self
            .get_device_profile_ids(device_id)?
            .iter()
            .skip_while(|v| v.is_none())
            .map(|v| v.clone().unwrap());

        if let Some(profile_id) = profile_ids.next() {
            Ok(profile_id)
        } else {
            Err(ProfileManagerError::EmptyProfileSlots(
                device_id.to_string(),
            ))
        }
    }

    pub fn get_profile(&self, profile_id: &ProfileId) -> Result<&Profile, ProfileManagerError> {
        self.profiles
            .get(profile_id)
            .ok_or_else(|| ProfileManagerError::ProfileNotFound(profile_id.to_string()))
    }

    /// Associate a [`Profile`] with a given [`DeviceId`]. If the [`Device`][Device] has not been registered with
    /// the `ProfileManager` yet, an error will be returned. Similarly, if the  has no empty
    /// `Profile` slots, an error will be returned.
    ///
    /// [Device]: crate::device::Device
    pub fn insert_profile(
        &mut self,
        device_id: &DeviceId,
        profile: Profile,
    ) -> Result<(), ProfileManagerError> {
        let profile_ids = if let Some(profile_ids) = self.device_profile_map.get(device_id) {
            profile_ids.clone()
        } else {
            return Err(ProfileManagerError::UnknownDevice(device_id.to_string()));
        };

        let next_available = profile_ids
            .iter()
            .enumerate()
            .filter_map(|(i, v)| v.as_ref().map_or_else(|| Some(i), |_| None))
            .next();

        if let Some(index) = next_available {
            let mut tet_clone = profile_ids.clone();
            tet_clone[index] = Some(profile.id.to_string());
            self.profiles.insert(profile.id.to_string(), profile);
            self.device_profile_map
                .insert(device_id.to_string(), tet_clone);
            Ok(())
        } else {
            Err(ProfileManagerError::InsufficientProfileSlots(
                device_id.to_string(),
            ))
        }
    }

    /// Overwrite an existing profile with a new profile. The provided [`ProfileId`]  must reference
    /// an existing profile associated with the given [`DeviceId`]. The existing profile will be
    /// deleted and its profile id will be disassociated with the [`DeviceId`].
    pub fn overwrite_profile(
        &mut self,
        device_id: &DeviceId,
        profile_id: &ProfileId,
        new_profile: Profile,
    ) -> Result<(), ProfileManagerError> {
        let profile_ids = if let Some(profile_ids) = self.device_profile_map.get(device_id) {
            profile_ids.clone()
        } else {
            return Err(ProfileManagerError::UnknownDevice(device_id.to_string()));
        };

        let profile_index = profile_ids
            .iter()
            .enumerate()
            .fold(None, |selected, (i, v)| {
                v.as_ref().map_or_else(
                    || None,
                    |v| if v == profile_id { Some(i) } else { selected },
                )
            });

        if let Some(index) = profile_index {
            let mut tet_clone = profile_ids.clone();
            tet_clone[index] = Some(new_profile.id.clone());

            self.profiles.remove(profile_id);
            self.profiles
                .insert(new_profile.id.to_string(), new_profile);

            self.device_profile_map
                .insert(device_id.to_string(), tet_clone);
            Ok(())
        } else {
            Err(ProfileManagerError::ProfileNotFound(profile_id.to_string()))
        }
    }

    pub fn delete_profile(
        &mut self,
        device_id: &DeviceId,
        profile_id: &ProfileId,
    ) -> Result<(), ProfileManagerError> {
        let profile_ids = if let Some(profile_ids) = self.device_profile_map.get(device_id) {
            profile_ids.clone()
        } else {
            return Err(ProfileManagerError::UnknownDevice(device_id.to_string()));
        };

        let profile_index = profile_ids
            .iter()
            .enumerate()
            .fold(None, |selected, (i, v)| {
                v.as_ref().map_or_else(
                    || None,
                    |v| if v == profile_id { Some(i) } else { selected },
                )
            });

        if let Some(index) = profile_index {
            self.profiles.remove(profile_id);
            let mut tet_clone = profile_ids.clone();
            tet_clone[index] = None;
            self.device_profile_map
                .insert(device_id.to_string(), tet_clone);
            Ok(())
        } else {
            Err(ProfileManagerError::ProfileNotFound(profile_id.to_string()))
        }
    }

    pub fn delete_device(&mut self, device_id: &DeviceId) -> Result<(), ProfileManagerError> {
        if let Some(profile_ids) = self.device_profile_map.remove(device_id) {
            profile_ids.iter().filter(|v| v.is_some()).for_each(|v| {
                self.profiles.remove(v.as_ref().unwrap());
            });
            Ok(())
        } else {
            Err(ProfileManagerError::UnknownDevice(device_id.to_string()))
        }
    }
}

impl Default for ProfileManager {
    fn default() -> Self {
        Self {
            device_profile_map: HashMap::new(),
            profiles: HashMap::new(),
        }
    }
}

impl Store for ProfileManager {
    fn storage_path() -> &'static str {
        "profiles.json"
    }

    #[instrument(skip_all)]
    fn from_storage(storage_manager: &StorageManager) -> Result<Self, StorageManagerError> {
        let pm = storage_manager.read_from_storage::<ProfileManager>(Self::storage_path());

        if let Err(StorageManagerError::CorruptionError(_)) = pm {
            warn!("Corrupted device configuration file. Attempting to delete the file.");
            storage_manager
                .delete_from_storage(Self::storage_path())
                .or_else(|e| {
                    error!(e=%e, "Encountered a non-derializable file at {}. Unable to delete the file.", Self::storage_path());
                    Err(e)
                })?;
        }
        pm
    }

    #[instrument(skip(storage_manager))]
    fn to_storage(&self, storage_manager: &StorageManager) -> Result<(), StorageManagerError> {
        let ser = serde_json::to_string(self)?;
        storage_manager.write_to_storage(Self::storage_path(), ser)
    }
}
