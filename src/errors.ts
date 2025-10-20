/**
 * This error is used for planned features that are partially or completely unimplemented at this time.
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

/**
 * General error reguardless of transport
 */
export class TransportError extends Error {
    constructor(message?: string) {
        super(message)
        this.name = "TransportError"
    }
}