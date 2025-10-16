export enum ActivityType {
    PLAYING,
    STREAMING,
    LISTENING,
    WATCHING,
    CUSTOM,
    COMPETING
}

export interface Timestamps {
    start?: number
    end?: number
}

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
    INSTANCE = 1,
    JOIN = 2,
    SPECTATE = 4,
    JOIN_REQUEST = 8,
    SYNC = 16,
    PLAY = 32,
    PARTY_PRIVACY_FRIENDS = 64,
    PARTY_PRIVACY_VOICE_CHANNEL = 128,
    EMBEDDED = 256
}

export interface Button {
    label: string
    url: string
}

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

