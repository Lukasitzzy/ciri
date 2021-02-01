import { ERROR_MESSAGES } from './ErrorMessages';

export class CustomError extends Error {
    code: string;
    private readonly _name: string;
    /**
     *
     */
    constructor(
        message: keyof typeof ERROR_MESSAGES,
        name: string,
        ...args: (string | string[])[]
    ) {
        const newMessage = intoCallAble(ERROR_MESSAGES[message])(...args);
        super(newMessage);
        this._name = name;

        this.code = message;
    }

    public get name(): string {
        return `${this._name || 'CustomError'} [${this.code}]`;
    }

    public toString(): string {
        return `${this.name}: ${this.message}`;
    }

}

function intoCallAble(thing: any): (...args: (string | string[])[]) => string {
    return typeof thing === 'function' ? thing : () => thing;
}

