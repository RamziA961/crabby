import { GlobalAction, TGlobalAction } from "./action";
import { TGlobalState } from "./initial_state";


export function GlobalReducer(state: TGlobalState, action: TGlobalAction) : TGlobalState {
    switch(action.action) {
        case GlobalAction.DEVICE_CONNECTED: {
            return state;
        }
        case GlobalAction.SET_SELECTED_DEVICE: {
            return {
                ...state,
                selectedDevice: action.payload?.device ?? state.selectedDevice,
            };
        }
        default: {
            return state;
        }
    }
}
