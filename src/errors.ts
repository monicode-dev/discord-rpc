/**
 * This error is used for planned features that are currently partially or not implemented yet.
 */
export class UnimplementedError extends Error {
    constructor(message?: string) {
        super(message)
        this.name = "UnimplementedError"
    }
}

/**
 * Any error related to the IPC socket
 */
export class IPCSocketError extends Error {
    constructor(message?: string) {
        super(message)
        this.name = "IPCSocketError"
    }
}
