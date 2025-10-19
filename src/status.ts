/**
 * All possible activity types.
 * The {@link STREAMING} type currently only supports Twitch (https://twitch.tv/) and YouTube (https://youtube.com/) urls.
 * 
 * @see {@link https://discord.com/developers/docs/events/gateway-events#activity-object-activity-types}
 */
export enum ActivityType {
    PLAYING,
    STREAMING,
    LISTENING,
    WATCHING,
    COMPETING = 5
}

export interface Timestamps {
    start?: number
    end?: number
}

/**
 * All types for controlling which field is displayed in the user's status text in the member list
 * 
 * @see {@link https://discord.com/developers/docs/events/gateway-events#activity-object-status-display-types}
 * @example
 * ```
 * status.setDetails("HONEST")
 * status.setState("Baby Keem")
 * status.setStatusDisplayType(DisplayType.DETAILS) // Will show "Listening to HONEST" in member list
 * ```
 */
export enum DisplayType {
    NAME,
    STATE,
    DETAILS
}

export interface Emoji {
    name: string
    id?: number
    animated?: boolean
}

export interface Party {
    id?: number
    size?: [current_size: number, max_size: number]
}

export interface Assets {
    large_image?: string
    large_text?: string
    large_url?: string
    small_image?: string
    small_text?: string
    small_url?: string
}

export interface Secrets {
    join?: string
    spectate?: string
    match?: string
}

export enum ActivityFlags {
    INSTANCE = 1 << 0,
    JOIN = 1 << 1,
    SPECTATE = 1 << 2,
    JOIN_REQUEST = 1 << 3,
    SYNC = 1 << 4,
    PLAY = 1 << 5,
    PARTY_PRIVACY_FRIENDS = 1 << 6,
    PARTY_PRIVACY_VOICE_CHANNEL = 1 << 7,
    EMBEDDED = 1 << 8
}

export interface Button {
    label: string
    url: string
}


/**
 * Represents a user's activity status
 * 
 * @see {@link https://discord.com/developers/docs/events/gateway-events#activity-object}
 */
export class ActivityStatus {
    private name: string
    private type: ActivityType
    private url?: string
    private created_at: number = Date.now()
    private timestamps?: Timestamps
    private application_id?: number
    private status_display_type?: DisplayType	
    private details?: string
    private details_url?: string
    private state?: string
    private state_url?: string
    private emoji?: Emoji
    private party?: Party
    private assets?: Assets
    private secrets?: Secrets
    private instance?: boolean
    private flags?: number
    private buttons?: Button[]

    /**
     * @param {string} name The name of the status
     * @param {?ActivityType} type The type of activity (Playing..., Listening to..., etc.)
     */
    constructor(name: string, type: ActivityType = ActivityType.PLAYING) {
        this.name = name
        this.type = type
    }

    public setName(name: string) {
        this.name = name
    }

    public setType(type: ActivityType) {
        this.type = type
    }

    public setUrl(url: string) {
        this.url = url
    }

    public setCreatedAt(timestamp: number) {
        this.created_at = timestamp
    }

    public setTimestamps(timestamps: Timestamps) {
        this.timestamps = timestamps
    }

    public setApplicationId(appId: number) {
        this.application_id = appId
    }

    public setStatusDisplayType(displayType: DisplayType) {
        this.status_display_type = displayType
    }

    public setDetails(details: string) {
        this.details = details
    }

    public setDetailsUrl(detailsUrl: string) {
        this.details_url = detailsUrl
    }

    public setState(state: string) {
        this.state = state
    }

    public setStateUrl(stateUrl: string) {
        this.state_url = stateUrl
    }

    public setEmoji(emoji: Emoji) {
        this.emoji = emoji
    }

    public setParty(party: Party) {
        this.party = party
    }

    public setAssets(assets: Assets) {
        this.assets = assets
    }

    public setSecrets(secrets: Secrets) {
        this.secrets = secrets
    }

    public setInstance(instance: boolean) {
        this.instance = instance
    }
    
    public setFlags(...flags: ActivityFlags[]) {
        if (flags.length != 0) {
            flags.forEach((flag) => {
                if (!this.flags) this.flags = 0
                this.flags |= flag
            })
        }
    }

    public setButtons(buttons: Button[]) {
        this.buttons = buttons
    }

    public addButton(button: Button) {
        if (!this.buttons) {
            this.buttons = [button]
        } else {
            this.buttons.push(button)
        }
    }

    public toString(): string { 
        return JSON.stringify(this)
    }
} 

