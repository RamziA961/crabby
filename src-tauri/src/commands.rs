use serde::{Deserialize, Serialize};
use specta::{collect_types, functions::FunctionDataType, ExportError, Type, TypeDefs};
use thiserror::Error;

use crate::{
    device::device_manager::DeviceManagerError, profile::profile_manager::ProfileManagerError,
};

pub mod device_commands;
pub mod profile_commands;

#[derive(Debug, Error, Serialize, Deserialize, Type)]
pub(crate) enum CommandError {
    #[error(transparent)]
    ProfileManagerError(#[from] ProfileManagerError),

    #[error(transparent)]
    DeviceManagerError(#[from] DeviceManagerError),

    #[error("StorageManagerError: {message}")]
    StorageManagerError { message: String },

    #[error("StateAccessError: {message}")]
    StateAcessError { message: String },
}

type CommandType = Result<(Vec<FunctionDataType>, TypeDefs), ExportError>;

pub(crate) fn export_commands() -> CommandType {
    collect_types![
        device_commands::delete_device,
        device_commands::get_connected_devices,
        profile_commands::get_profile,
        profile_commands::get_device_profile_ids,
        profile_commands::insert_profile,
        profile_commands::overwrite_profile,
        profile_commands::delete_profile,
    ]
}
