import React from "react";

import { GlobalAction, TGlobalAction } from "@models/global/action";
import { TGlobalState } from "@models/global";
import { DeviceImage, TDevice } from "@models/device";
import { Carousel, Status, StatusIndicator } from "@ui";
import { DeviceExtendedInfoPanel } from "./device_extended_info_panel";

import "@styles/landing_page.css";


export type LandingPageProps = {
    globalState: TGlobalState,
    globalDispatch: React.Dispatch<TGlobalAction>,
};

export function LandingPage({
    globalState,
    globalDispatch
}: LandingPageProps): React.ReactElement {
    const [infoPanelExpanded, setInfoPanelExpanded] = React.useState(false);

    React.useEffect(() => {
        if(!globalState.selectedDevice) {
            globalDispatch({
                action: GlobalAction.SET_SELECTED_DEVICE,
                payload: {
                    device: globalState.knownDevices[0]
                }
            });
        }
    }, [globalState, globalDispatch]);

    const setDevice = React.useCallback((device: TDevice) => {
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
                        <DeviceExtendedInfoPanel
                            dispatch={globalDispatch}
                            selectedDevice={globalState.selectedDevice}
                            expanded={infoPanelExpanded}
                            profileManager={globalState.profileManager}
                            close={() => {
                                if(infoPanelExpanded) {
                                    setInfoPanelExpanded(false);
                                }
                            }}
                        />
                    </>
                    :
                    <ConnectDeviceAvatar />
            }
        </div>
  );
}

type DeviceCarouselProps = {
    id?: string;
    selectedDevice: TDevice;
    devices: TDevice[];
    expandInfo: (event: React.MouseEvent) => void;
    setSelectedDevice: (device: TDevice) => void;
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
    const selectedDeviceIndex = devices.indexOf(selectedDevice) ?? 0;
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
    device: TDevice;
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
                    src={`/src/assets/${DeviceImage[device.model.key as keyof typeof DeviceImage]}`}
                    className="w-full"
                    onClick={e => onClick?.(e)}
                />
            </StatusIndicator>
            <div className="device-quick-info">
                <h3>
                    { device.name }
                </h3>
                <h4 className="">
                    { device.model.name }
                </h4>
            </div>
        </div>
    );
}

function ConnectDeviceAvatar(): React.ReactElement {
    return (
        <div className="
            flex flex-col justify-center items-center
            prose"
        >
            <h1>Connect a device</h1>
        </div>
    );
}
