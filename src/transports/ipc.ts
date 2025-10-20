import type { ClosePayload, CommandPayload, Payload } from "../playloads.ts";
import { HandshakePayload } from "../playloads.ts";
import type { Transport } from "./transport.ts";
import { IPCSocketError } from "../errors.ts";

export enum OpCode {
    HANDSHAKE,
    FRAME,
    CLOSE,
    PING,
    PONG,
}

export class IPCFrame {
    opcode: OpCode;
    payload: Payload;

    constructor(payload: Payload, opcode: OpCode = OpCode.FRAME) {
        this.opcode = opcode;
        this.payload = payload;
    }
}

export class IPCClient extends EventTarget implements Transport {
    private conn?: Deno.Conn;
    private isWin: boolean;
    private ipcPath: string;

    constructor() {
        super();
        this.isWin = Deno.build.os === "windows";

        if (this.isWin) {
            this.ipcPath = "\\\\?\\pipe\\";
        } else {
            const runtimeDir = Deno.env.get("XDG_RUNTIME_DIR") + "/" ||
                `${Deno.env.get("HOME")}/.config/discord` + "/";

            this.ipcPath = runtimeDir;
        }
    }

    close(): void {
        throw new Error("Method not implemented.");
    }

    private async pump() {
        if (!this.conn) {
            throw new IPCSocketError(
                "Socket not initalized before attempting listening to stream",
            );
        }
        for await (const chunk of this.conn.readable) {
            this.dispatchEvent(new CustomEvent("message", { detail: chunk }));
            console.log(new TextDecoder().decode(chunk));
        }
        this.dispatchEvent(new Event("close"));
    }

    public on(
        type: string,
        listener: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions,
    ): void {
        this.addEventListener(type, listener, options);
    }

    public off(
        type: string,
        callback: EventListenerOrEventListenerObject | null,
        options?: EventListenerOptions | boolean,
    ): void {
        this.removeEventListener(type, callback, options);
    }

    /**
     * Prepares the IPC socket
     * @param {number | string} clientId The client ID to use for initilization
     */
    public async init(clientId: string): Promise<void> {
        if (this.conn) return;

        for (let i = 0; i < 10; i++) {
            try {
                this.conn = await Deno.connect({
                    transport: "unix",
                    path: this.ipcPath + `discord-ipc-${i}`,
                });
            } catch (_) {
                // Try next index
            }
        }
        if (this.conn) {
            // this.pump();
            const handshakePayload = new HandshakePayload(
                clientId,
                crypto.randomUUID(),
            );
            this.write(handshakePayload, OpCode.HANDSHAKE);

            const responseFrame = await this.read();
            if (responseFrame.opcode == OpCode.CLOSE) {
                throw new IPCSocketError(
                    (responseFrame.payload as ClosePayload).message,
                );
            } else {
                const payload = responseFrame.payload as CommandPayload;
                if (payload.evt == "ERROR") {
                    throw new IPCSocketError("Unknown error");
                }
            }
        } else {
            throw new IPCSocketError(
                "Could not connect to any discord-ipc socket",
            );
        }
    }

    /**
     * Writes a frame to the IPC socket.
     * @param {Frame} frame The frame to be writen to the IPC socket.
     * @returns {Promise<number>} Resolves to the number of bytes written.
     * @throws IPCSocketError if socket has not been initialized.
     */
    public async write(payload: Payload, opcode: OpCode = OpCode.FRAME): Promise<number> {
        if (this.conn) {
            const json = new TextEncoder().encode(payload.toString());

            const buf = new Uint8Array(8 + json.length);
            const view = new DataView(buf.buffer);

            view.setUint32(0, opcode, true);
            view.setUint32(4, json.length, true);
            buf.set(json, 8);

            console.log({ opcode, payload });
            
            return (await this.conn.write(buf));
        } else {
            throw new IPCSocketError(
                "Socket not initialzied before attempting to write",
            );
        }
    }

    /**
     * Reads the frame in the IPC socket.
     * @returns {Promise<IPCFrame>} Resolves to an {@link IPCFrame}
     * @throws IPCSocketError if socket has not been initialized.
     */
    public async read(): Promise<IPCFrame> {
        if (this.conn) {
            const header = new Uint8Array(8);
            await this.conn.read(header);
            const view = new DataView(header.buffer);
            const opcode = view.getUint32(0, true) as OpCode;
            const length = view.getUint32(4, true);

            const body = new Uint8Array(length);
            await this.conn.read(body);
            
            const payload = JSON.parse(
                new TextDecoder().decode(body),
            ) as Payload;

            console.log({ opcode, payload });
            
            return { opcode, payload };
        } else {
            throw new IPCSocketError(
                "Socket not initialzied before attempting to read",
            );
        }
    }
}
