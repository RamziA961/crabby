import { DeviceType, TDevice, TMouse } from "@models/device";

export type TGlobalState = {
    selectedDevice?: TMouse;   
    conntectedDevices: TDevice[];
};

export const GlobalInitialState: TGlobalState = {
    conntectedDevices: [
        {
            id: "1",
            name: "Mouse 1",
            deviceType: DeviceType.MOUSE,
            dpi: 800,
        },
        {
            id: "2",
            name: "Keyboard 1",
            deviceType: DeviceType.KEYBOARD,
            keyCount: 84,
        },
    ],
} as const;
