import React from "react";

import { GlobalAction, TGlobalAction } from "@models/global/action";
import { TGlobalState } from "@models/global";
import { DeviceImage } from "@models/device";
import { Carousel, Status, StatusIndicator } from "@ui";
import { DeviceExtendedInfoPanel } from "./device_extended_info_panel";

import "@styles/landing_page.css";
import { Command, isCommandError } from "@models/command";
import { Device } from "bindings";


export type LandingPageProps = {
    globalState: TGlobalState,
    globalDispatch: React.Dispatch<TGlobalAction>,
};

export function LandingPage({
    globalState,
    globalDispatch
}: LandingPageProps): React.ReactElement {
    const [infoPanelExpanded, setInfoPanelExpanded] = React.useState(false);

    const getConnectedDevices = React.useCallback(async () => {
        const res = await Command.getConnectedDevices();
        if(isCommandError(res)) {
            return;
        }

        globalDispatch({
            action: GlobalAction.SET_KNOWN_DEVICES,
            payload: {
                knownDevices: res
            }
        });
        return getConnectedDevices;
    }, [globalDispatch]);
    
    React.useEffect(() => {
        /* NOTE: This is for testing purposes.
         * Polling will be replaced with events based communication.
         */
        getConnectedDevices();
        const interval = setInterval(
            getConnectedDevices,
            2000
        );
        return () => clearInterval(interval);
    }, [getConnectedDevices])

    React.useEffect(() => {
        if(!globalState.selectedDevice && globalState.knownDevices.length > 0) {
            globalDispatch({
                action: GlobalAction.SET_SELECTED_DEVICE,
                payload: {
                    device: globalState.knownDevices[0]
                }
            });
        }
    }, [globalState, globalDispatch]);

    const setDevice = React.useCallback((device: Device) => {
        globalDispatch({
            action: GlobalAction.SET_SELECTED_DEVICE,
            payload: {
                device: device
            }
        });
    }, [globalDispatch]);

    return (
        <div id="landing-page">
            {
                globalState.selectedDevice ? 
                    <>
                        <DeviceCarousel
                            selectedDevice={globalState.selectedDevice}
                            devices={globalState.knownDevices}
                            setSelectedDevice={setDevice}
                            expandInfo={(e: React.MouseEvent) => {
                                if(!infoPanelExpanded) {
                                    e.stopPropagation()
                                    setInfoPanelExpanded(true)
                                }
                            }}
                            disabled={infoPanelExpanded}
                        />
                        {/*<DeviceExtendedInfoPanel
                            dispatch={globalDispatch}
                            selectedDevice={globalState.selectedDevice}
                            expanded={infoPanelExpanded}
                            profileManager={globalState.profileManager}
                            close={() => {
                                if(infoPanelExpanded) {
                                    setInfoPanelExpanded(false);
                                }
                            }}
                        />*/}
                    </>
                    :
                    <ConnectDeviceAvatar />
            }
        </div>
  );
}

type DeviceCarouselProps = {
    id?: string;
    selectedDevice: Device;
    devices: Device[];
    expandInfo: (event: React.MouseEvent) => void;
    setSelectedDevice: (device: Device) => void;
    disabled?: boolean;
}

function DeviceCarousel({
    id,
    selectedDevice,
    devices,
    expandInfo,
    setSelectedDevice,
    disabled = false,
}: DeviceCarouselProps): React.ReactElement {
    const selectedDeviceIndex = Math.max(
        devices
            .map(d => d.id)
            .indexOf(selectedDevice.id), 
        0
    );
    const onSettled = React.useCallback((index: number) => {
        setSelectedDevice(devices[index]);
    }, [devices, setSelectedDevice]); 

    return (
        <Carousel
            id={id}
            threshold={7}
            selectedChild={selectedDeviceIndex}
            onSettled={onSettled}
            disabled={disabled}
            classNames={`w-full max-w-full`}
        >
            {   
                devices.map((device, index) => (
                    <DeviceAvatar 
                        key={device.id}
                        id={device.id}
                        device={device}
                        onClick={expandInfo}
                        selected={index === selectedDeviceIndex}
                        connected={true}
                    />
                ))
            }
        </Carousel>
    );
}

type DeviceAvatarProps = {
    id?: string;
    device: Device;
    onClick?: (event: React.MouseEvent) => void;
    selected: boolean;
    connected: boolean;
};

function DeviceAvatar({
    id,
    device,
    onClick,
    selected,
    connected
}: DeviceAvatarProps): React.ReactElement {
    return (
        <div 
            id={id}
            className="h-full w-full 
            flex flex-col justify-center items-center
            gap-4
            "
        >
            <StatusIndicator
                status={connected ? Status.Online : Status.Offline}
                verticalPosition="bottom"
                horizontalPosition="end"
                classNames="w-1/4"
                indicatorClassNames="d-badge-sm"
            >
                <img 
                    src={`/src/assets/${DeviceImage[device.model as keyof typeof DeviceImage]}`}
                    className="w-full"
                    onClick={e => onClick?.(e)}
                />
            </StatusIndicator>
            <div className="device-quick-info">
                <h3>
                    { device.id }
                </h3>
                <h4 className="">
                    { device.model }
                </h4>
            </div>
        </div>
    );
}

function ConnectDeviceAvatar(): React.ReactElement {
    return (
        <div className="
            w-full h-full
            flex flex-col justify-center items-center
            prose-h1:prose-2xl prose-neutral"
        >
            <h1>Connect a crabby device</h1>
        </div>
    );
}
