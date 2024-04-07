use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Clone, Debug, Deserialize, Serialize, Type)]
#[cfg_attr(test, derive(PartialEq))]
pub struct Keyboard {}
