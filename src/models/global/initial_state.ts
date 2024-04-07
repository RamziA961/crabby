import { TDevice } from "@models/device";

export type TGlobalState = {
    selectedDevice?: TDevice;   
    knownDevices: TDevice[];
};

export const GlobalInitialState: TGlobalState = {
    knownDevices: []
} as const;
