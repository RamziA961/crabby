export enum GlobalAction {
    SET_SELECTED_DEVICE,
    SET_KNOWN_DEVICES,
}

export type TGlobalAction = { action: GlobalAction, payload?: {[key: string]: any }};
