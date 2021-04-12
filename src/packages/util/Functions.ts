import { CommandOptions } from 'discord-akairo';
import { DiscordBot } from '../core/src/client/Client';
import { CustomCommand } from '../core/src/commands/CustomCommand';
import { Api } from './typings/Discord.js.Api';
import { exec } from 'child_process';

export function getApi(client: DiscordBot): Api {
    return Reflect.get(client, 'api');
}
type ExtendableCls<K> = new (...args: any[]) => K;
export function applyOptions(options: { id: string; description: any; options: CommandOptions; }) {
    return (cls: ExtendableCls<CustomCommand>): any => {
        abstract class Extended extends cls {
            constructor() {
                super(options);
            }
        }

        return Extended;
    };
}


export function getGitCommit(): Promise<string> {
    return new Promise<string>((res, rej) => {
        exec('git git rev-parse HEAD', (err, stdout, stderr) => {
            if (err) {
                return rej(err);
            }
            if (stdout) {
                return res(stdout);
            }
            rej(new Error(stderr));
        });
    });
}
