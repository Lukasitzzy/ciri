import * as chalk from 'chalk';
const ENABLE_FILE_LOGGING = process.env.ENABLE_FILE_LOGGING === 'true';
export class Logger {

    private readonly _prefix: string;


    constructor(prefix: string) {
        this._prefix = prefix;
    }


    public log(message: string): void {
        return;
    }


    public debug(message: string, issuer?: string): void {
        return this._write({
            message,
            type: 'DEBUG',
            issuer
        });
    }

    private _write(
        { message, type, issuer }: { message: string; type: 'LOG' | 'ERROR' | 'DEBUG' | 'INFO' | 'SLASH-COMMAND-RUN' | 'COMMAND-RUN'; issuer?: string; }): void {

        const nType = this._parseType(type);
        const time = this._parseTime();


        if (ENABLE_FILE_LOGGING) {
            return;
        }

        return;
    }


    private _parseType(type: 'LOG' | 'ERROR' | 'DEBUG' | 'INFO' | 'SLASH-COMMAND-RUN' | 'COMMAND-RUN'): string {
        let str = '';
        switch (type) {
            case 'LOG':
                str = chalk.rgb(229, 149, 175)(type);
                break;


            case 'ERROR':
                str = chalk.rgb(252, 12, 16)(type);
                break;

            case 'DEBUG':
                str = chalk.yellow(type);
                break;

            case 'INFO':

                str = chalk.blueBright(type);
                break;
            case 'SLASH-COMMAND-RUN':
                str = chalk.rgb(50, 239, 16)(type.replace(/-/g, '_'));
                break;

            case 'COMMAND-RUN':
                str = chalk.rgb(12, 192, 252)(type.replace(/-/g, '_'));
                break;
            default:
                str = chalk.hex('#e5a295')(type);
                break;
        }

        return str;
    }


    private _parseTime() {

        const newstr = '{{days}}/{{months}}/{{years}} {{hours}}:{{minutes}}';

        const date = new Date();

        const day = this._parseNumber(date.getDay());
        const month = this._parseNumber(date.getMonth() + 1);
        const year = date.getFullYear();
        const hour = this._parseNumber(date.getHours());
        const minute = this._parseNumber(date.getMinutes());

        console.log(...[day, month, year, hour, minute]);

        return newstr;
    }


    private _parseNumber(n: number): string {
        return n < 10 ? `0${n}` : n.toString();
    }

}