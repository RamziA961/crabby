import { TDevice } from "@models/device";
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
        case GlobalAction.RENAME_DEVICE: {
            const { payload } = action;
            if(!(payload && payload.device && payload.name)) {
                return state;
            }

            const deviceIndex = state.knownDevices
                .findIndex(device => device.id === payload.device.id);
            
            if(deviceIndex < 0) {
                return state;
            }

            const device: TDevice = {
                ...state.knownDevices[deviceIndex],
                name: payload.name,
            };

            const knownDevices = [
                ...state.knownDevices.slice(0, deviceIndex),
                device,
                ...state.knownDevices.slice(deviceIndex + 1, state.knownDevices.length)
            ];

            if(state.selectedDevice && state.selectedDevice.id === device.id) {
                return {
                    ...state,
                    selectedDevice: device,
                    knownDevices,
                };
            }

            return {
                ...state,
                knownDevices,
            };
        }
        /* Profile Management */
        case GlobalAction.CREATE_PROFILE: {
            const { payload } = action;
            if(!payload || !payload.deviceId || !payload.profile) {
                return state;
            }

            return {
                ...state,
                profileManager: state.profileManager
                    .createProfile(payload.deviceId, payload.profile),
            };
        }
        case GlobalAction.DELETE_PROFILE: {
            const { payload } = action;
            if(!payload || !payload.deviceId || !payload.profileId) {
                return state;
            }

            return {
                ...state,
                profileManager: state.profileManager
                    .deleteProfile(payload.deviceId, payload.profileId),
            };
        }
        case GlobalAction.EDIT_PROFILE: {
            const { payload } = action;
            if(!payload || !payload.deviceId || !payload.payloadId || !payload.profile) {
                return state;
            }

            return {
                ...state,
                profileManager: state.profileManager
                    .overwriteProfile(payload.deviceId, payload.profileId, payload.profile)
            };
        }

        default: {
            return state;
        }
    }
}
