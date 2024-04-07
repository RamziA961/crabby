import React from "react";
import { TDevice } from "@models/device";
import { IconButton, useClickAway } from "@ui";
import { DeviceInfo } from "./device_info";
import { TGlobalAction } from "@models/global";
import { ProfileManager } from "@models/profile";
import { DeviceProfileSelect } from "./device_profile_select";

export type DeviceExtendedInfoPanelProps = {
    expanded?: boolean;
    selectedDevice: TDevice;
    close: () => void
    profileManager: ProfileManager;
    dispatch: React.Dispatch<TGlobalAction>
}

export function DeviceExtendedInfoPanel({ 
    expanded = false, 
    selectedDevice,
    close,
    profileManager,
    dispatch,
}: DeviceExtendedInfoPanelProps): React.ReactElement {
    const [transformStyle, setTransfomStyle] = React.useState<React.CSSProperties>({});
    const ref = useClickAway<HTMLDivElement>(close);

    React.useEffect(() => {
        if(!ref || typeof ref === "function" || !ref.current) {
            return;
        }

        setTransfomStyle({
            transform: `translate(${expanded ? `calc(-${ref.current.clientWidth}px)` : "0"}, 0px)`,
            transition: "transform 0.25s",
        });
    }, [expanded]);

    return (
        <div 
            id="device-extended-info-panel"
            ref={ref}
            className="absolute w-[30vw] h-screen left-full top-0 
                bg-success rounded-s-md shadow-md
                p-2
                flex flex-col
            "
            style={transformStyle}
        >
            <div id="device-extended-info-panel-header"
                className="mb-4"
            >
                <IconButton
                    id="device-extended-info-panel-close-button"
                    onClick={close}
                >
                    <> X </>
                </IconButton>
            </div>
            <DeviceInfo active={expanded} device={selectedDevice} dispatch={dispatch} /> 
            <DeviceProfileSelect 
                dispatch={dispatch} 
                profileManager={profileManager} 
                device={selectedDevice}
            />
        </div>
    );
}

