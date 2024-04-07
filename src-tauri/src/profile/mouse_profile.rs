use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Clone, Debug, Deserialize, Serialize, Type)]
pub struct MouseProfile {
    pub(super) dpi: u16,
}

impl MouseProfile {
    pub(crate) fn dpi(&self) -> u16 {
        self.dpi
    }
}
