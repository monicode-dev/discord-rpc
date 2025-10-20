import type { Payload } from "../playloads.ts";
import type { OpCode } from "./ipc.ts";

export interface Transport extends EventTarget {
    on(
        type: string,
        listener: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions,
    ): void;

    off(
        type: string,
        callback: EventListenerOrEventListenerObject | null,
        options?: EventListenerOptions | boolean,
    ): void;

    init(clientId: number | string): Promise<void>;

    write(payload: Payload, opcode?: OpCode): Promise<number>;

    close(): void
}
