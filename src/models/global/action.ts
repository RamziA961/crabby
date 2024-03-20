export enum GlobalAction {
    DEVICE_CONNECTED,
    SET_SELECTED_DEVICE,
}

export type TGlobalAction = { action: GlobalAction, payload?: {[key: string]: any }};
