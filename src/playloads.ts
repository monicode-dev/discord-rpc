export enum RPCCommand {
    DISPATCH = "DISPATCH", 
    AUTHORIZE = "AUTHORIZE", // TODO: has args unimplemneted
    AUTHENTICATE = "AUTHENTICATE", // TODO: has args unimplemneted
    GET_GUILD = "GET_GUILD",  //  TODO: has args unimplemneted
    GET_GUILDS = "GET_GUILDS",
    GET_CHANNEL = "GET_CHANNEL", // TODO: has args unimplemneted
    GET_CHANNELS = "GET_CHANNELS", // TODO: has args unimplemneted
    SUBSCRIBE = "SUBSCRIBE", // TODO: has args unimplemneted
    UNSUBSCRIBE = "UNSUBSCRIBE", // TODO: has args unimplemneted
    SET_USER_VOICE_SETTINGS = "SET_USER_VOICE_SETTINGS", // TODO: has args unimplemneted
    SELECT_VOICE_CHANNEL = "SELECT_VOICE_CHANNEL", // TODO: has args unimplemneted
    GET_SELECTED_VOICE_CHANNEL = "GET_SELECTED_VOICE_CHANNEL", 
    SELECT_TEXT_CHANNEL = "SELECT_TEXT_CHANNEL", // TODO: has args unimplemneted
    GET_VOICE_SETTINGS = "GET_VOICE_SETTINGS", 
    SET_VOICE_SETTINGS = "SET_VOICE_SETTINGS", // TODO: has args unimplemneted
    SET_CERTIFIED_DEVICES = "SET_CERTIFIED_DEVICES", // TODO: has args unimplemneted
    SET_ACTIVITY = "SET_ACTIVITY",
    SEND_ACTIVITY_JOIN_INVITE = "SEND_ACTIVITY_JOIN_INVITE", // TODO: has args unimplemneted
    CLOSE_ACTIVITY_REQUEST = "CLOSE_ACTIVITY_REQUEST", // TODO: has args unimplemneted
}

export interface Payload {
    nonce?: `${string}-${string}-${string}-${string}-${string}`;

    toString(): string;
}

export class HandshakePayload implements Payload {
    v: number = 1;
    client_id: string;
    access_token?: string;
    scopes?: string;
    nonce?: `${string}-${string}-${string}-${string}-${string}`;

    constructor(
        clientId: string,
        nonce?: `${string}-${string}-${string}-${string}-${string}`,
    ) {
        this.client_id = clientId;
        this.nonce = nonce;
    }

    public toString(): string {
        return JSON.stringify(this);
    }
}

export class CommandPayload implements Payload {
    cmd: RPCCommand;
    nonce?: `${string}-${string}-${string}-${string}-${string}`;
    evt?: string;
    // deno-lint-ignore no-explicit-any
    data?: any;
    // deno-lint-ignore no-explicit-any
    args?: any;

    constructor(
        cmd: RPCCommand,
        // deno-lint-ignore no-explicit-any
        args: any,
        nonce?: `${string}-${string}-${string}-${string}-${string}`,
    ) {
        this.cmd = cmd;
        this.args = args
        this.nonce = nonce;
    }

    public toString(): string {
        return JSON.stringify(this);
    }
}

export class ClosePayload implements Payload {
    code?: number;
    message?: string;
    readonly nonce?: `${string}-${string}-${string}-${string}-${string}`;

    constructor(message?: string) {
        this.message = message;
    }

    public toString(): string {
        return JSON.stringify(this);
    }
}

export class PingPayload implements Payload {
    nonce?: `${string}-${string}-${string}-${string}-${string}`;

    constructor(nonce?: `${string}-${string}-${string}-${string}-${string}`) {
        this.nonce = nonce;
    }

    public toString(): string {
        return JSON.stringify(this);
    }
}

export class PongPayload implements Payload {
    nonce?: `${string}-${string}-${string}-${string}-${string}`;

    constructor(nonce?: `${string}-${string}-${string}-${string}-${string}`) {
        this.nonce = nonce;
    }

    public toString(): string {
        return JSON.stringify(this);
    }
}
