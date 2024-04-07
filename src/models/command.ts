import {
    getConnectedDevices,
    deleteDevice,
    getProfile,
    getActiveProfile,
    getDeviceProfileIds,
    insertProfile,
    overwriteProfile,
    deleteProfile,
    Device,
    Profile,
} from "../bindings";

type ProfileManagerError = {
    ProfileManagerError: ProfileManagerErrorVariants
}

type ProfileManagerErrorVariants = {
    DeviceAlreadyRegistered: string
} | {
    InsufficientProfileSlots: string
} | {
    ProfileNotFound: string
} | {
    EmptyProfileSlots: string
} | {
    NonEmptyProfileSlots: string
} | {
    UnknownDevice: string
};

type DeviceManagerError = {
    DeviceManagerError: DeviceManagerErrorVariants
}

type DeviceManagerErrorVariants = {
    DeviceNotFound: string
} | {
    DeviceAlreadyRegistered: string
};

type StorageManagerError = {
    StorageManagerError: StorageManagerErrorVariants
}

type StorageManagerErrorVariants = {
    message: string
}

type StateAccessError = {
    StateAccessError: StateAccessErrorVariants
}

type StateAccessErrorVariants = {
    message: string
}

export type CommandError = 
    ProfileManagerError | 
    DeviceManagerError | 
    StorageManagerError | 
    StateAccessError; 

export function isCommandError(obj: any): obj is CommandError {
    return isProfileManagerError(obj) ||
        isDeviceManagerError(obj) ||
        isStorageManagerError(obj) ||
        isStateAccessError(obj);
}

export function isProfileManagerError(obj: any): obj is ProfileManagerError {
    return "ProfileManagerError" in obj;
}

export function isDeviceManagerError(obj: any): obj is DeviceManagerError {
    return "DeviceManagerError" in obj;
}
export function isStorageManagerError(obj: any): obj is StorageManagerError {
    return "StorageManagerError" in obj;
}
export function isStateAccessError(obj: any): obj is StateAccessError {
    return "StateAccessError" in obj;
}

/**
 * A class with a one to one mapping of the functions in `bindings.ts`.
 * Due to the short comings of the tauri-specta library, the Rust bindings
 * are incomplete as functions lack the correct return signature.
 *
 * Tauri commands can be invoked through this class, with the benefit of 
 * correctly typed return signatures.
 *
 * ```rust
 * #[tauri::command]
 * #[specta::specta]
 * async fn hello() -> Result<String, CommandError> {
 * // implementation
 * }
 * ```
 * Will be typed as:
 * ```typescript
 * async function hello(): string | CommandError {
 * // implementation     
 * }
 * 
 * ```
 *
 * @file bindings.ts
 * @file commands.rs
 */
export class Command {
    static async getConnectedDevices(): Promise<Device[] | CommandError> {
        return this.runCommand(() => getConnectedDevices());
    }
    
    static async deleteDevice(deviceId: string): Promise<null | CommandError> {
        return this.runCommand(() => deleteDevice(deviceId));
    }

    static async getProfile(profileId: string): Promise<Profile | CommandError> {
        return this.runCommand(() => getProfile(profileId));
    }

    static async getActiveProfile(deviceId: string): Promise<Profile | CommandError> {
        return this.runCommand(() => getActiveProfile(deviceId));
    }

    static async getDeviceProfileIds(deviceId: string): Promise<(string | null)[] | CommandError> {
        return this.runCommand(() => getDeviceProfileIds(deviceId));
    }

    static async insertProfile(deviceId: string, profile: Profile): Promise<null | CommandError> {
        return this.runCommand(() => insertProfile(deviceId, profile));
    }

    static async overwriteProfile(deviceId: string, profileId: string, profile: Profile): Promise<null | CommandError> {
        return this.runCommand(() => overwriteProfile(deviceId, profileId, profile));
    }
    
    static async deleteProfile(deviceId: string, profileId: string): Promise<null | CommandError> {
        return this.runCommand(() => deleteProfile(deviceId, profileId));
    }

    private static async runCommand<T>(fn: () => Promise<T>): Promise<T | CommandError> {
        console.log(`Command Invoked: ${fn}`);
        try {
            const res = await fn();
            return res;
        } catch(e) {
            return e as unknown as CommandError;
        }

    }
}
