import React from "react";

import { TDevice } from "@models/device";
import { ProfileManager, TProfileId } from "@models/profile";
import { TGlobalAction } from "@models/global";

export type DeviceProfileSelectProps = {
    device: TDevice,
    profileManager: ProfileManager,
    dispatch: React.Dispatch<TGlobalAction>
}

export function DeviceProfileSelect({
    device,
    profileManager,
    dispatch,
}: DeviceProfileSelectProps): React.ReactElement {
    const profileIds = React.useMemo(() => 
        profileManager.getDeviceProfileIds(device.id)?.filter(id => id !== undefined),
    []);

    return (
        <div id="profile-selector">
            { profileIds?.map((id, i) => 
                <ProfileSelectAvatar profileId={id!} content={(i+1).toString().padStart(2, "0")}/>
            )}
        </div>
    );
}

type ProfileSelectAvatarProps = {
    content: string;
    profileId: TProfileId;
} 

function ProfileSelectAvatar({ content, profileId } : ProfileSelectAvatarProps): React.ReactElement {
    return (
        <div className="profile-select-avatar">
            <h1>{content}</h1>
        </div>
    );
}
