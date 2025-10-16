export class UnimplementedError extends Error {
    constructor(message?: string) {
        super(message)
        this.name = "UnimplementedError"
    }
}

export class IPCSocketError extends Error {
    constructor(message?: string) {
        super(message)
        this.name = "IPCSocketError"
    }
}
