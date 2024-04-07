import { v4 as uuidv4 } from "uuid";
import { TDeviceId } from "./device";

export type TProfileId = string;
export type TProfile = TMouseProfile | TKeyboardProfile;

export type TMouseProfile = {
    dpi: number,
}

export type TKeyboardProfile = {

}

type TProfileJson = {
    id: TProfileId;
    deviceId: TDeviceId;
    profile: TProfile; 
}

const DEFAULT_MOUSE_PROFILE: TMouseProfile = {
    dpi: 800,
} as const;

const DEFUALT_KEYBOARD_PROFILE: TKeyboardProfile = {

} as const;

function isTMouseProfile(profile: TProfile): profile is TMouseProfile {
    return "dpi" in profile;
}

function isTKeyboardProfile(profile: TProfile): profile is TKeyboardProfile {
    return !isTMouseProfile(profile);
}


/**
 * Singleton class that manages device profile state.
 */
export class ProfileManager {
    private deviceProfileMap: Map<TDeviceId, [TProfileId?, TProfileId?, TProfileId?, TProfileId?]>;
    private profileMap: Map<TProfileId, TProfile>;

    private constructor(
        deviceProfileMap: Map<TDeviceId, [TProfileId?, TProfileId?, TProfileId?, TProfileId?]>,
        profiles: Map<TProfileId, TProfile>,
    ) {
        this.deviceProfileMap = deviceProfileMap;
        this.profileMap = profiles;
    }

    public static initialize(): ProfileManager {
        return new ProfileManager(new Map(), new Map());
    }

    public static fromJson(json: TProfileJson[]): ProfileManager {
        const deviceProfileMap = new Map();
        const profiles = new Map();
        const deviceToProfileData: Map<TDeviceId, {id: TProfileId, profile: TProfile}[]> = new Map();
        
        json.forEach(({id, deviceId, profile}) => {
            const entry = deviceToProfileData.get(deviceId) ?? [];
            deviceToProfileData.set(deviceId, [...entry, { id, profile }]);
        });

        deviceToProfileData.forEach((profileArr, deviceId) => {
            profileArr.forEach(({id, profile}) => {
                profiles.set(id, profile);
            });
            
            let ids = profileArr.map(({id}) => id);
            if(ids.length < 4) {
                const padding: TProfileId[]  = new Array(4 - ids.length).fill(undefined);
                ids = [...ids, ...padding];
            }

            deviceProfileMap.set(deviceId, ids);
        })

        return new ProfileManager(deviceProfileMap, profiles);
    }

    public toJson(): TProfileJson[] {
        return [... this.deviceProfileMap.entries()]
            .map(([deviceId, profileIds]) => 
                 profileIds
                     .filter(id => id !== undefined)
                     .map(id => ({ 
                         id: id!,
                         profile: this.profileMap.get(id!)!,
                         deviceId: deviceId 
                     }))
            )
            .flat()
    }

    public getProfile(id: TProfileId): TProfile | undefined {
        return this.profileMap.get(id);
    }

    public getDeviceProfileIds(deviceId: TDeviceId): [TProfileId?, TProfileId?, TProfileId?, TProfileId?] | undefined {
        return this.deviceProfileMap.get(deviceId);
    }


    public overwriteProfile(deviceId: TDeviceId, profileId: TProfileId, profile: TProfile): ProfileManager {
        if(!this.deviceProfileMap.has(deviceId) || !this.profileMap.has(profileId)) {
            return this;
        }

        const profiles = new Map(this.profileMap);
        profiles.set(profileId, profile);
        return new ProfileManager(
            this.deviceProfileMap,
            profiles,
        );
    }

    public createProfile(deviceId: TDeviceId, profile: TProfile): ProfileManager {
        const id = uuidv4();
        const deviceProfiles = this.deviceProfileMap.get(deviceId);
        if(!deviceProfiles) {
            return this;
        }

        const profiles = new Map(this.profileMap);
        const deviceProfileMap = new Map(this.deviceProfileMap);
        profiles.set(id, profile);
        for(let i = 0; i < deviceProfiles.length; i++) {
            if(!deviceProfiles[i]) {
                deviceProfiles[i] = id;
                break;
            }
        }
        deviceProfileMap.set(deviceId, deviceProfiles);
        return new ProfileManager(deviceProfileMap, profiles);
    }

    public deleteProfile(deviceId: TDeviceId, profileId: TProfileId): ProfileManager {
        if(!this.deviceProfileMap.has(deviceId)) {
            return this;
        }
        const deviceProfiles: [TProfileId?, TProfileId?, TProfileId?, TProfileId?] = 
            [...this.deviceProfileMap.get(deviceId)!];
        
        const profileIdx = deviceProfiles.findIndex(id => id === profileId);
        if(profileIdx === -1) {
            return this;
        }
        
        deviceProfiles[profileIdx] = undefined;
        for(let i = profileIdx; i < deviceProfiles.length - 1; i++) {
            if(!deviceProfiles[i] && deviceProfiles[i + 1]) {
                deviceProfiles[i] = deviceProfiles[i + 1];
                deviceProfiles[i + 1] = undefined;
            }
        }
        
        const deviceProfileMap = new Map(this.deviceProfileMap);
        deviceProfileMap.set(deviceId, deviceProfiles);

        const profileMap = new Map(this.profileMap);
        profileMap.delete(profileId);

        return new ProfileManager(deviceProfileMap, profileMap);
    }
}

