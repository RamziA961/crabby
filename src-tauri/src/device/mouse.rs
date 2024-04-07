use serde::{Deserialize, Serialize};
use specta::Type;
use tracing::error;

#[derive(Clone, Debug, Deserialize, Serialize, Type)]
#[cfg_attr(test, derive(PartialEq))]
pub struct Mouse {
    pub dpi: u16,
}

impl std::fmt::Display for Mouse {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match serde_json::to_string_pretty(&self) {
            Ok(v) => write!(f, "{v}"),
            Err(e) => {
                error!(e=%e);
                write!(f, "{e}")
            }
        }
    }
}

impl Default for Mouse {
    fn default() -> Self {
        Self { dpi: 800 }
    }
}
