import { GlobalAction, TGlobalAction } from "./action";
import { TGlobalState } from "./initial_state";


export function GlobalReducer(state: TGlobalState, action: TGlobalAction) : TGlobalState {
    switch(action.action) {
        case GlobalAction.SET_SELECTED_DEVICE: {
            return {
                ...state,
                selectedDevice: action.payload?.device ?? state.selectedDevice,
            };
        }
        case GlobalAction.SET_KNOWN_DEVICES: {
            const { payload } = action;
            if(!payload || !payload?.knownDevices || !Array.isArray(payload?.knownDevices)) {
                return state;
            }
            console.log(payload)
            return {
                ...state,
                knownDevices: payload.knownDevices
            };
        }

        default: {
            return state;
        }
    }
}
