import { DeviceType, TDevice } from "@models/device";
import { ProfileManager } from "@models/profile";

export type TGlobalState = {
    profileManager: ProfileManager;
    selectedDevice?: TDevice;   
    knownDevices: TDevice[];
};

export const GlobalInitialState: TGlobalState = {
    profileManager: ProfileManager.initialize(),
    knownDevices: [
        {
            id: "d069ed5e-3f58-421d-8ab1-b50ea21846e3",
            name: "Ramzi's Mouse",
            model: {
                key: "m1", 
                name: "M1 Prototype",
            },
            deviceType: DeviceType.MOUSE,
            connected: true,
            softwareVersion: "0.0.1",
            firstConnected: new Date("2024-03-24"),
            lastConnected: new Date("2024-03-24"),
            selected_profile: "",
            dpi: 800,
        },
        {
            id: "6693616e-76c6-41e6-853f-0e5db1d2857f",
            name: "Ramzi's Keyboard",
            model: {
                key: "k1",
                name: "K1 Prototype",
            },
            deviceType: DeviceType.KEYBOARD,
            connected: false,
            softwareVersion: "0.0.1",
            firstConnected: new Date("2024-03-24"),
            lastConnected: new Date("2024-03-24"),
            selected_profile: "",
            keyCount: 84,
        },
    ],
} as const;
