import { IPCSocketError, UnimplementedError } from "./errors.ts";
import { CloseFrame, CommandFrame, HandshakeFrame, OpCode, RPCCommand } from "./frame.ts";
import type { ActivityStatus } from "./status.ts";

export class RPCClient {
    private clientId: string;
    private createdAt: number;
    private websocketMode: boolean;
    private conn?: Deno.Conn;

    constructor(clientId: string, websocketMode: boolean = false) {
        this.clientId = clientId;
        this.createdAt = Date.now()
        this.websocketMode = websocketMode;

        if (websocketMode) {
            throw new UnimplementedError(
                "Websockets are currently not supported and will be implemented at a leter date",
            );
        }
    }

    private async ipcInit(): Promise<void> {
        if (this.conn) return

        const isWin = Deno.build.os === "windows";
        const runtimeDir = Deno.env.get("XDG_RUNTIME_DIR") + "/" ||
            `${Deno.env.get("HOME")}/.config/discord` + "/";
        const ipcPath = isWin ? "\\\\?\\pipe\\" : runtimeDir;

        for (let i = 0; i < 10; i++) {
            try {
                this.conn = await Deno.connect({
                    transport: "unix",
                    path: ipcPath + `discord-ipc-${i}`,
                });
            } catch (_) {
                // Try next index
            }
        }
        if (this.conn) {
            this.conn.write(new HandshakeFrame(this.clientId).encode());

            const responseFrame = await this.readFrame()
            if (responseFrame.payload.data.evt == "ERROR" || responseFrame.opcode == OpCode.CLOSE) throw new IPCSocketError("Unknown error")
        } else {
            throw new IPCSocketError(
                "Could not connect to any discord-ipc socket",
            );
        }
    }

    // deno-lint-ignore no-explicit-any
    private async readFrame(): Promise<{ opcode: number, payload: any }> {
        if (this.conn) {
            const header = new Uint8Array(8);
            await this.conn.read(header);
            const view = new DataView(header.buffer);
            const opcode = view.getUint32(0, true);
            const length = view.getUint32(4, true);

            const body = new Uint8Array(length);
            await this.conn.read(body);
            const payload = JSON.parse(new TextDecoder().decode(body));
            
            return { opcode, payload };
        } else {
            throw new IPCSocketError("Failed to read incomming frame")
        }
    }

    public async init(): Promise<void> {
        if (this.websocketMode) {
            throw new UnimplementedError(
                "Websockets are currently not supported and will be implemented at a leter date",
            );
        } 

        if (this.conn) {
            return
        } else {
            await this.ipcInit();
        }
    }

    public setActivity(activity: ActivityStatus) {
        if (this.conn) {
            activity.setCreatedAt(this.createdAt)
            const frame = new CommandFrame(RPCCommand.SET_ACTIVITY, { pid: Deno.pid, activity: activity })
            this.conn.write(frame.encode())

            this.readFrame()
        } else {
            throw new IPCSocketError("Socket not intialized")
        }
    }

    public close() {
        if (this.conn) {
            this.conn.write(new CloseFrame().encode())
            this.conn.close()
            this.conn = undefined
        } else {
            return
        }
    }
}
