
import { Device } from "bindings";
import { TProfileId } from "./profile";

export type TDevice = TMouse | TKeyboard;

export type TBaseDevice = Device & {
    name: string;
    softwareVersion: string;
    firstConnected: Date;
    lastConnected: Date;
    connected: boolean;
    selected_profile: TProfileId;
}

export type TMouse = TBaseDevice & {
    dpi: number;
}

export type TKeyboard = TBaseDevice & {
    keyCount: number;
}

export const DeviceImage = {
    m1: "devices/mouse.png",
    k1: "devices/keyboard.png",
} as const;
