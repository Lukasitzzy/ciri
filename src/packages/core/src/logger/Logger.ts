import * as chalk from 'chalk';
import { appendFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
const ENABLE_FILE_LOGGING = process.env.ENABLE_FILE_LOGGING === 'true';
export class Logger {

    private readonly _prefix: string;
    private readonly _shards: number[];

    constructor(shards = [0, 1]) {
        this._prefix = '0 --|';

        this._shards = shards;
    }


    public log(message: string, issuer?: string): void {
        return this._write({
            message,
            issuer,
            type: 'LOG'
        });
        return;
    }

    public error(error: Error, issuer?: string): void {
        return this._write({
            message: `${error.name}: ${error.message}`,
            type: 'ERROR',
            issuer
        });
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
        issuer = issuer?.toUpperCase();
        const nType = this._parseType(type);
        const time = this._parseTime();

        const str = [
            this._prefix,
            this._shards.length ? `[ ${this._shards.join(', ')} ]` : '',
            `[${time}]`,
            `<${nType}>`,
            issuer ? `[${issuer}]` : '',
            message
        ].filter((v) => !!v).join(' ');

        console.log(str);
        if (ENABLE_FILE_LOGGING) {
            const MESSAGE = chalk.reset(str);
            const LOG_FILE_EXT = process.env.LOG_FILE_EXT || '.log';
            const date = time.split(/\s+/g)[0];
            const FILE = join(process.cwd(), 'logs', `${date}.${LOG_FILE_EXT}`);

            if (existsSync(FILE)) {
                appendFileSync(FILE, MESSAGE, { encoding: 'utf-8' });
            } else {
                writeFileSync(FILE, str, { encoding: 'utf-8' });
            }
            return;
        }
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

        const day = this._parseNumber(date.getUTCDate());

        const month = this._parseNumber(date.getMonth() + 1);
        const year = date.getFullYear();
        const hour = this._parseNumber(date.getHours());
        const minute = this._parseNumber(date.getMinutes());


        return newstr.replace(
            /{{days}}/g, day
        ).replace(
            /{{months}}/g, month
        ).replace(
            /{{years}}/g, year.toString()
        ).replace(
            /{{hours}}/g, hour
        ).replace(
            /{{minutes}}/g, minute
        );
    }


    private _parseNumber(n: number): string {
        return n < 10 ? `0${n}` : n.toString();
    }

}
