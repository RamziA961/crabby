export enum GlobalAction {
    DEVICE_CONNECTED,
    SET_SELECTED_DEVICE,
    RENAME_DEVICE,

    /* Profile Management */
    CREATE_PROFILE,
    DELETE_PROFILE,
    EDIT_PROFILE,
}

export type TGlobalAction = { action: GlobalAction, payload?: {[key: string]: any }};
