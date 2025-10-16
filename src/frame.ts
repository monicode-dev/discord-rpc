import type { ActivityStatus } from "./status.ts";

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

// deno-lint-ignore no-empty-interface
export interface FrameArgs { }

export interface SetActivityArgs extends FrameArgs {
    pid: number
    activity: ActivityStatus
}

export enum OpCode {
    HANDSHAKE,
    FRAME,
    CLOSE,
    PING,
    PONG
}

interface Frame {
    nonce?: string;

    encode(): Uint8Array<ArrayBuffer>
    toString(): string
}

export class HandshakeFrame implements Frame {
    private clientId: string;
    nonce: string

    constructor(clientId: string) {
        this.clientId = clientId;
        this.nonce = crypto.randomUUID();
    }

    public encode() {
        const json = new TextEncoder().encode(JSON.stringify({ v: 1, client_id: this.clientId }));
        const buf = new Uint8Array(8 + json.length);
        const view = new DataView(buf.buffer);

        view.setUint32(0, OpCode.HANDSHAKE, true); 
        view.setUint32(4, json.length, true); 
        buf.set(json, 8);
        return buf;
    }

    public toString(): string {
        return JSON.stringify(this);
    }
}

export class CommandFrame implements Frame {
    cmd: RPCCommand;
    args: FrameArgs;
    nonce: string;

    constructor(cmd: RPCCommand, args: FrameArgs) {
        this.cmd = cmd;
        this.args = args
        this.nonce = crypto.randomUUID();
    }

    public encode(): Uint8Array<ArrayBuffer> {
        const json = new TextEncoder().encode(this.toString());
        
        const buf = new Uint8Array(8 + json.length); 
        const view = new DataView(buf.buffer);

        view.setUint32(0, OpCode.FRAME, true); 
        view.setUint32(4, json.length, true); 
        buf.set(json, 8);
        return buf;
    }

    public toString(): string {
        return JSON.stringify(this);
    }
}

export class CloseFrame implements Frame {
    constructor() {
        
    }

    public encode(): Uint8Array<ArrayBuffer> {
        const json = new TextEncoder().encode(this.toString());
        const buf = new Uint8Array(8 + json.length); 
        const view = new DataView(buf.buffer);

        view.setUint32(0, OpCode.CLOSE, true); 
        view.setUint32(4, json.length, true); 
        buf.set(json, 8);
        return buf;
    }

    public toString(): string {
        return JSON.stringify(this);
    }
}

export class PingFrame implements Frame {
    nonce: string

    constructor() {
        this.nonce = crypto.randomUUID();
    }

    public encode(): Uint8Array<ArrayBuffer> {
        const json = new TextEncoder().encode(this.toString());
        const buf = new Uint8Array(8 + json.length); 
        const view = new DataView(buf.buffer);

        view.setUint32(0, OpCode.PING, true); 
        view.setUint32(4, json.length, true); 
        buf.set(json, 8);
        return buf;
    }

    public toString(): string {
        return JSON.stringify(this);
    }
}

export class PongFrame implements Frame {
    nonce: string

    constructor() {
        this.nonce = crypto.randomUUID();
    }

    public encode(): Uint8Array<ArrayBuffer> {
        const json = new TextEncoder().encode(this.toString());
        const buf = new Uint8Array(8 + json.length); 
        const view = new DataView(buf.buffer);

        view.setUint32(0, OpCode.PONG, true); 
        view.setUint32(4, json.length, true); 
        buf.set(json, 8);
        return buf;
    }

    public toString(): string {
        return JSON.stringify(this);
    }
}