use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Clone, Debug, Deserialize, Serialize, Type)]
pub(crate) struct KeyboardProfile {}
