import React from "react";

import { GlobalAction, TGlobalAction } from "@models/global/action"
import { TDevice } from "@models/device"
import { IconButton } from "@ui";

import EditIcon from "@assets/icons/edit_icon.svg?react";
import CheckIcon from "@assets/icons/check_icon.svg?react";

export type DeviceInfoProps = {
    dispatch: React.Dispatch<TGlobalAction>;
    device: TDevice;
    active: boolean;
}

export const DeviceInfo = React.memo(function QuickControls({ 
    active,
    dispatch, 
    device,
}: DeviceInfoProps): React.ReactElement {
    const rename = React.useCallback((name: string) => {
        dispatch({
            action: GlobalAction.RENAME_DEVICE,
            payload: { device, name }
        });
    }, [device, dispatch]);

    return (
        <div id="device-info" className="flex flex-col">
            <div id="extended-info" 
                className="d-card d-card-body bg-base-300 prose-base prose-h5:prose-sm"
            >
                <div className="flex justify-between items-center not-prose">
                    <RenameTextInput
                        active={active}
                        content={device.name}
                        onEditComplete={rename}
                    />
                    <span className="d-badge d-badge-md d-badge-accent">{device.model.name}</span>
                </div>
                <h5>Device ID: {device.id}</h5>
                <h5>Sofware Version: {device.softwareVersion}</h5>
                <h5>Paired on: {device.firstConnected.toDateString()}</h5>
                <h5>Last Seen: {device.connected ? "Now" : device.lastConnected.toDateString()}</h5>
            </div>
        </div>
    );
});

type RenameTextInputProps = {
    active: boolean;
    content: string;
    onEditComplete: (name: string) => void;
}

function RenameTextInput({
    active,
    content,
    onEditComplete
}: RenameTextInputProps): React.ReactElement {
    const [isEditing, setIsEditing] = React.useState(false);
    const [currContent, setCurrContent] = React.useState(content);
    const [isValid, setIsValid] = React.useState(true);
    console.log(active);
    React.useEffect(() => {
        if(!active) { 
            setIsEditing(false);
        }
        setCurrContent(content);
    }, [active, content, setIsEditing]);


    const validate = React.useCallback((name: string) => {
        if (!name || name.length < 2 || name.length > 18) {
            return false;
        }
        const valid = /[A-Za-z][\w'-_ ]{0,16}[\w]/;
        return name.match(valid)?.length === 1;
    }, []);

    return (
        <div className="d-join flex">
            <input 
                type="text"
                className={`d-input d-join-item 
                    d-input-sm 
                    ${isValid ? "" : "d-input-error"}
                `}
                disabled={!isEditing}
                value={currContent}
                placeholder="Enter device name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { 
                   setIsValid(validate(e.target.value));
                   setCurrContent(e.target.value);
                }}
            />
            {isEditing ? (
                <IconButton
                    classNames="d-join-item"
                    disabled={!isValid}
                    onClick={() => {
                        setIsEditing(false);
                        onEditComplete(currContent);
                    }}
                >
                    <CheckIcon width={12} height={12}/>
                </IconButton>
            ) : (
                <IconButton
                    classNames="d-join-item"
                    onClick={() => setIsEditing(true)}
                >
                    <EditIcon width={12} height={12} color="white"/>
                </IconButton>
            )}

        </div>
    );
}

