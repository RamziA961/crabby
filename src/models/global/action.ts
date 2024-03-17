export enum GlobalAction {
    Hello = ""
}

export type TGlobalAction = { action: GlobalAction, payload?: {[key: string]: any }};
