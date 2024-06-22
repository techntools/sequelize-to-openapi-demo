export type ResponseData = Record<string, any> | Record<string, any>[]

export class ServerResponse {
    success: boolean
    message?: string

    constructor(success: boolean, message?: string) {
        this.success = success;
        this.message = message;
    }

    toJSON() {
        return {
            success: this.success,
            message: this.message,
        }
    }
}

export class FailureResponse extends ServerResponse {
    code?: string
    details: {}

    constructor(message: string, code?: string, details?: {} | []) {
        super(false, message)
        this.code = code
        this.details = details
    }

    toJSON() {
        return {
            ...super.toJSON(),
            details: this.details,
            code: this.code,
        }
    }
}

export class SuccessResponse extends ServerResponse {
    data?: ResponseData

    constructor(data?: ResponseData) {
        super(true, undefined)
        this.data = data
    }

    toJSON() {
        return {
            ...super.toJSON(),
            data: this.data
        }
    }
}
