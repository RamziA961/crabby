use serde::{Deserialize, Serialize};
use specta::Type;
use uuid::Uuid;

use crate::device::{DeviceId, DeviceModel};

mod default_profile_provider;
pub mod keyboard_profile;
pub mod mouse_profile;
pub mod profile_manager;

use default_profile_provider::DefaultProfileProvider;
use keyboard_profile::KeyboardProfile;
use mouse_profile::MouseProfile;

pub(crate) type ProfileId = String;

#[derive(Clone, Debug, Serialize, Deserialize, Type)]
pub(crate) enum ProfileConfiguration {
    Mouse(MouseProfile),
    Keyboard(KeyboardProfile),
}

#[derive(Clone, Debug, Serialize, Deserialize, Type)]
pub(crate) struct Profile {
    id: ProfileId,
    device_id: DeviceId,
    configuration: ProfileConfiguration,
}

impl Profile {
    pub(crate) fn new(device_id: &DeviceId, configuration: ProfileConfiguration) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            device_id: device_id.to_string(),
            configuration,
        }
    }

    pub(crate) fn get_default_provide_configuration(
        device_model: DeviceModel,
    ) -> ProfileConfiguration {
        DefaultProfileProvider::profile(device_model)
    }

    pub(crate) fn get_id(&self) -> &ProfileId {
        &self.id
    }

    pub(crate) fn get_device_id(&self) -> &DeviceId {
        &self.device_id
    }

    pub(crate) fn get_configuration(&self) -> &ProfileConfiguration {
        &self.configuration
    }
}
