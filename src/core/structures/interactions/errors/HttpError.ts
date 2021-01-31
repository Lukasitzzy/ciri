

export class HTTPError extends Error {
    code: string;
    status: number;
    /**
     *
     */
    constructor(
        message: string,
        code: string,
        status: number
    ) {
        super(message);

        this.code = code;
        this.status = status;
    }

    get name(): string {
        return `HTTPError[${this.status}<${this.code}>]`;
    }

    toString(): string {
        return `${this.name}: ${this.message}`;
    }

}