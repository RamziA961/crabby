export type TDevice = TMouse | TKeyboard;

export enum DeviceType {
    MOUSE,
    KEYBOARD,
}

export type TBaseDevice = {
    id: string;
    name: string;
    deviceType: DeviceType;
}

export type TMouse = TBaseDevice & {
    dpi: number;
}

export type TKeyboard = TBaseDevice & {
    keyCount: number;
}
