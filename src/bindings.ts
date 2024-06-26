/* eslint-disable */
// This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

declare global {
    interface Window {
        __TAURI_INVOKE__<T>(cmd: string, args?: Record<string, unknown>): Promise<T>;
    }
}

// Function avoids 'window not defined' in SSR
const invoke = () => window.__TAURI_INVOKE__;

export function deleteDevice(deviceId: string) {
    return invoke()<null>("delete_device", { deviceId })
}

export function getConnectedDevices() {
    return invoke()<Device[]>("get_connected_devices")
}

export function getProfile(profileId: string) {
    return invoke()<Profile>("get_profile", { profileId })
}

export function getActiveProfile(deviceId: string) {
    return invoke()<Profile>("get_active_profile", { deviceId })
}

export function getDeviceProfileIds(deviceId: string) {
    return invoke()<(string | null)[]>("get_device_profile_ids", { deviceId })
}

export function insertProfile(deviceId: string, profile: Profile) {
    return invoke()<null>("insert_profile", { deviceId,profile })
}

export function overwriteProfile(deviceId: string, profileId: string, profile: Profile) {
    return invoke()<null>("overwrite_profile", { deviceId,profileId,profile })
}

export function deleteProfile(deviceId: string, profileId: string) {
    return invoke()<null>("delete_profile", { deviceId,profileId })
}

export type Device = { id: string; model: DeviceModel; device_type: DeviceType; active_profile: string }
export type ProfileConfiguration = { Mouse: MouseProfile } | { Keyboard: KeyboardProfile }
export type DeviceType = { Mouse: Mouse } | { Keyboard: Keyboard }
export type MouseProfile = { dpi: number }
export type DeviceModel = "M1" | "K1"
export type KeyboardProfile<> = null
export type Profile = { id: string; device_id: string; configuration: ProfileConfiguration }
export type Keyboard<> = null
export type Mouse = { dpi: number }
