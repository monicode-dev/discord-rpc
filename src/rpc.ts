import { TransportError, UnimplementedError } from "./errors.ts";
import { ClosePayload, CommandPayload, RPCCommand } from "./playloads.ts";
import type { ActivityStatus } from "./status.ts";
import { IPCClient, OpCode } from "./transports/ipc.ts";
import type { Transport } from "./transports/transport.ts";

/**
 * Represents the client connected to the RPC server
 */
export class RPCClient {
    private clientId: string;
    private createdAt: number;
    private websocketMode: boolean;
    private transport?: Transport

    /**
     * @param clientId The client id provided on the Discord Developer Portal for your app
     * @param websocketMode If websockets should be used over IPC (currently throws an {@link UnimplementedError} when runing {@link init})
     */
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

    /**
     * Will setup the client for connecting to the RPC server. Throws an {@link UnimplementedError} if {@link websocketMode} is set to true
     */
    public async init(): Promise<void> {
        if (this.transport) return
        if (this.websocketMode) {
            throw new UnimplementedError(
                "Websockets are currently not supported and will be implemented at a leter date",
            );
        } else {
            this.transport = new IPCClient()
            await this.transport.init(this.clientId)
        }
    }

    /**
     * Updates the user activity status. Throws {@link IPCSocketError} if {@link init} has not been ran or if {@link close} has been
     * @param {ActivityStatus} activity 
     */
    public setActivity(activity: ActivityStatus) {
        if (this.transport) {
            activity.setCreatedAt(this.createdAt)
            this.transport.write(new CommandPayload(RPCCommand.SET_ACTIVITY, { pid: Deno.pid, activity: activity }, crypto.randomUUID()))
        } else {
            throw new TransportError("Client not intialized")
        }
    }

    /**
     * Closes the current connection to RPC. Returns if client was never initialized
     */
    public close(): void {
        if (this.transport) {
            this.transport.write(new ClosePayload(), OpCode.CLOSE)
            this.transport.close()
            this.transport = undefined
        } else {
            return
        }
    }
}
