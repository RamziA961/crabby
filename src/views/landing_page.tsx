import React, { useCallback } from "react";

import { GlobalAction, TGlobalAction } from "@models/global/action";
import { TGlobalState } from "@models/global";
import { TDevice } from "@models/device";
import { Carousel } from "@ui";

import ReactSvg from "../assets/react.svg";

export type LandingPageProps = {
    globalState: TGlobalState,
    globalDispatch: React.Dispatch<TGlobalAction>,
};

export function LandingPage({
    globalState,
    globalDispatch
}: LandingPageProps): React.ReactElement {    

    React.useEffect(() => {
        if(!globalState.selectedDevice) {
            globalDispatch({
                action: GlobalAction.SET_SELECTED_DEVICE,
                payload: {
                    device: globalState.conntectedDevices[0]
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
    }, [globalDispatch])


    return (
        <div
            className="
            min-h-screen min-w-screen
            flex flex-col justify-center items-stretch
            "
        >
            {
                globalState.selectedDevice ? 
                    <DeviceCarousel 
                        selectedDevice={globalState.selectedDevice}
                        devices={globalState.conntectedDevices}
                        setSelectedDevice={setDevice}
                    /> 
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
    setSelectedDevice: (device: TDevice) => void;
}
function DeviceCarousel({
    id,
    selectedDevice,
    devices,
    setSelectedDevice,
}: DeviceCarouselProps): React.ReactElement {
    const selectedDeviceIndex = devices.indexOf(selectedDevice) ?? 0;
    const onSettled = useCallback((index: number) => {
        setSelectedDevice(devices[index]);
    }, [devices]); 

    return (
        <Carousel
            id={id}
            threshold={7}
            selectedChild={selectedDeviceIndex}
            onSettled={onSettled}
            classNames="w-full max-w-full"
        >
            {   
                devices.map((device, index) => (
                    <DeviceAvatar 
                        key={device.id}
                        id={device.id}
                        device={device}
                        onClick={setSelectedDevice}
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
    onClick?: (device: TDevice) => void;
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
            gap-2 prose-md
            "
        >
            <img 
                src={ReactSvg} 
                className="w-5/12"
            />
            <h3 className="text-center">
                { device.name }
            </h3>
        </div>
    );
}

function ConnectDeviceAvatar(): React.ReactElement {
    
    return (
        <div className="d-hero-content 
            flex flex-col justify-center items-center
            prose"
        >
            <h1>Connect a device</h1>
        </div>
    );
}
