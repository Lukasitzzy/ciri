
export class CustomError extends Error {
    private _errorId: string;
    private _showCustomStack: boolean;
    constructor(
        message: string,
        ID: string,
        showStack = false,
        name?: string
    ) {

        super(message);
        if (name) {
            this.name = name;
        }
        this._errorId = ID;
        this._showCustomStack = showStack;
        // is this even needed???
        if (!showStack) {
            Error.captureStackTrace(this, Error);
        }
    }

    public toString(): string {
        return [
            `${this.name}:`,
            this._errorId ? `[${this._errorId}]` : '',
            this.message,
            this._showCustomStack ? this.parseStack() || '' : ''
        ].filter(r => !!r).join(' ');
    }

    private parseStack() {

        if (!this.stack) {
            return null;
        }

        const lines = this.stack.split('\n').slice(1);
        let stack = '';
        for (const line of lines) {
            stack += line;
        }
        return stack;

    }

}