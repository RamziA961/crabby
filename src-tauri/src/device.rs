use serde::{Deserialize, Serialize};
use specta::Type;

pub mod device_manager;
pub mod keyboard;
pub mod mouse;

use keyboard::Keyboard;
use mouse::Mouse;
use uuid::Uuid;

use crate::profile::ProfileId;

pub type DeviceId = String;

#[derive(Clone, Debug, Type)]
#[cfg_attr(test, derive(PartialEq))]
pub enum DeviceModel {
    M1,
    K1,
}

impl ToString for DeviceModel {
    fn to_string(&self) -> String {
        match self {
            Self::M1 => "M1",
            Self::K1 => "K1",
        }
        .to_string()
    }
}

impl Serialize for DeviceModel {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.to_string().as_str())
    }
}

impl<'de> Deserialize<'de> for DeviceModel {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        match s.as_str() {
            "M1" => Ok(DeviceModel::M1),
            "K1" => Ok(DeviceModel::K1),
            _ => Err(serde::de::Error::unknown_variant(&s, &["M1", "K1"])),
        }
    }
}

#[derive(Clone, Debug, Deserialize, Serialize, Type)]
#[cfg_attr(test, derive(PartialEq))]
pub enum DeviceType {
    Mouse(Mouse),
    Keyboard(Keyboard),
}

#[derive(Clone, Debug, Deserialize, Serialize, Type)]
#[cfg_attr(test, derive(PartialEq))]
pub struct Device {
    id: DeviceId,
    model: DeviceModel,
    device_type: DeviceType,
    active_profile: ProfileId,
}

impl Device {
    pub fn get_id(&self) -> &DeviceId {
        &self.id
    }

    pub fn get_model(&self) -> &DeviceModel {
        &self.model
    }

    pub fn get_device_type(&self) -> &DeviceType {
        &self.device_type
    }

    pub fn get_active_profile(&self) -> &ProfileId {
        &self.active_profile
    }

    pub fn set_active_profile(&mut self, profile_id: ProfileId) {
        self.active_profile = profile_id;
    }

    pub fn builder() -> DeviceBuilder {
        DeviceBuilder::new()
    }
}

pub struct DeviceBuilder {
    id: DeviceId,
    model: Option<DeviceModel>,
    device_type: Option<DeviceType>,
    acitve_profile: Option<ProfileId>,
}

impl DeviceBuilder {
    fn new() -> Self {
        let id = Uuid::new_v4().to_string();
        Self {
            id,
            model: None,
            device_type: None,
            acitve_profile: None,
        }
    }
    
    pub fn get_id(&self) -> &DeviceId {
        &self.id
    }

    pub fn with_id(mut self, id: DeviceId) -> Self {
        self.id = id;
        self
    }

    pub fn get_model(&self) -> &Option<DeviceModel> {
        &self.model
    }

    pub fn with_model(mut self, model: DeviceModel) -> Self {
        self.model = Some(model);
        self
    }

    pub fn with_device_type(mut self, device_type: DeviceType) -> Self {
        self.device_type = Some(device_type);
        self
    }

    pub fn with_active_profile(mut self, profile_id: ProfileId) -> Self {
        self.acitve_profile = Some(profile_id);
        self
    }

    pub fn build(self) -> Device {
        Device {
            id: self.id,
            model: self.model.unwrap(),
            device_type: self.device_type.unwrap(),
            active_profile: self.acitve_profile.unwrap(),
        }
    }
}
