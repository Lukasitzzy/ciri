import { CommandOptions } from 'discord-akairo';
import { DiscordBot } from '../core/src/client/Client';
import { CustomCommand } from '../core/src/commands/CustomCommand';
import { Api } from './typings/Discord.js.Api';
import { exec } from 'child_process';
import { PermissionString } from 'discord.js';
import { Message } from 'discord.js';
import { CommandContext } from '../core/src/commands/CommandContext';

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

function _enumerable(val: boolean) {
    return (cls: unknown, prop: string): void => {
        Object.defineProperty(cls, prop, {
            enumerable: val,
            set(this: unknown, value: unknown) {
                Object.defineProperty(this, prop, {
                    configurable: true,
                    enumerable: val,    
                    value: value,
                    writable: true
                });
            }
        });
    };
}

export const enumerable = _enumerable(false);

export function hasCustomPermissions() {
    return (cls: ExtendableCls<CustomCommand>): any => {
        abstract class Extended extends cls {
            public readonly requireCustomPermissions = true;
        }

        return Extended;
    };
}

export function requireDefaultPermissions(perms: PermissionString[]) {
    return (cls: ExtendableCls<CustomCommand>): any => {
        abstract class Extended extends cls {
            public userPermissions = perms;

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
