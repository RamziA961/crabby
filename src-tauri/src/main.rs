// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::async_runtime::RwLock;
use tauri_specta::ts;

pub mod commands;
pub mod device;
pub mod profile;
pub mod state;
pub mod storage_manager;

mod start_up;

fn main() {
    ts::export(commands::export_commands(), "../src/bindings.ts").unwrap();

    let _ = tracing_subscriber::fmt().pretty().init();
    let state = RwLock::new(start_up::run());

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            commands::device_commands::delete_device,
            commands::device_commands::get_connected_devices,
            commands::profile_commands::get_profile,
            commands::profile_commands::get_device_profile_ids,
            commands::profile_commands::insert_profile,
            commands::profile_commands::overwrite_profile,
            commands::profile_commands::delete_profile,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
