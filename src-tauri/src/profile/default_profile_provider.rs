use super::{keyboard_profile::KeyboardProfile, mouse_profile::MouseProfile, ProfileConfiguration};
use crate::device::DeviceModel;

pub(super) struct DefaultProfileProvider;

impl DefaultProfileProvider {
    pub(super) fn profile(model: DeviceModel) -> ProfileConfiguration {
        match model {
            DeviceModel::K1 => ProfileConfiguration::Keyboard(KeyboardProfile {}),
            DeviceModel::M1 => ProfileConfiguration::Mouse(MouseProfile { dpi: 800 }),
        }
    }
}
