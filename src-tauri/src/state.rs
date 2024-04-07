use crate::{
    device::device_manager::DeviceManager, profile::profile_manager::ProfileManager,
    storage_manager::StorageManager,
};

#[derive(Debug, Default)]
pub(crate) struct ApplicationState {
    device_manager: DeviceManager,
    storage_manager: StorageManager,
    profile_manager: ProfileManager,
}

impl ApplicationState {
    pub fn new(
        device_manager: DeviceManager,
        storage_manager: StorageManager,
        profile_manager: ProfileManager,
    ) -> Self {
        Self {
            device_manager,
            storage_manager,
            profile_manager,
        }
    }

    pub(crate) fn get_device_manager(&self) -> &DeviceManager {
        &self.device_manager
    }

    pub(crate) fn get_storage_manager(&self) -> &StorageManager {
        &self.storage_manager
    }

    pub(crate) fn get_profile_manager(&self) -> &ProfileManager {
        &self.profile_manager
    }

    pub(crate) fn get_device_manager_mut(&mut self) -> &mut DeviceManager {
        &mut self.device_manager
    }

    pub(crate) fn get_storage_manager_mut(&mut self) -> &mut StorageManager {
        &mut self.storage_manager
    }

    pub(crate) fn get_profile_manager_mut(&mut self) -> &mut ProfileManager {
        &mut self.profile_manager
    }
}

#[derive(Debug)]
pub(crate) struct ApplicationStateBuilder {
    device_manager: Option<DeviceManager>,
    storage_manager: Option<StorageManager>,
    profile_manager: Option<ProfileManager>,
}

impl ApplicationStateBuilder {
    pub fn new() -> Self {
        Self {
            device_manager: None,
            storage_manager: None,
            profile_manager: None,
        }
    }

    pub fn with_device_manager(mut self, device_manager: DeviceManager) -> Self {
        self.device_manager = Some(device_manager);
        self
    }

    pub fn with_storage_manager(mut self, storage_manager: StorageManager) -> Self {
        self.storage_manager = Some(storage_manager);
        self
    }

    pub fn with_profile_manager(mut self, profile_manager: ProfileManager) -> Self {
        self.profile_manager = Some(profile_manager);
        self
    }

    pub fn build(self) -> ApplicationState {
        ApplicationState::new(
            self.device_manager.unwrap_or_default(),
            self.storage_manager.unwrap_or_default(),
            self.profile_manager.unwrap_or_default(),
        )
    }
}
