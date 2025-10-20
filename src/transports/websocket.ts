import type { Payload } from "../playloads.ts";
import type { OpCode } from "./ipc.ts";
import type { Transport } from "./transport.ts";

export class WSClient extends EventTarget implements Transport {
    constructor() {
        super()
    }
    close(): void {
        throw new Error("Method not implemented.");
    }

    on(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void {
        throw new Error("Method not implemented.");
    }

    off(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void {
        throw new Error("Method not implemented.");
    }
    
    write(payload: Payload, opcode?: OpCode): Promise<number> {
        throw new Error("Method not implemented.");
    }

    public async init() {

    }
}