import { CommandOptions } from 'discord-akairo';
import { PermissionString } from 'discord.js';
import { CustomCommand } from '../core/src/commands/CustomCommand';
import { CommandDescription } from './typings/util';

type ExtendableCls<K> = new (...args: any[]) => K;
export function applyOptions(options: { id: string; description: CommandDescription; options: CommandOptions; }) {
    return (cls: ExtendableCls<CustomCommand>): any => {
        abstract class Extended extends cls {
            constructor() {
                super(options);
            }
        }

        return Extended;
    };
}


function _requireChannel(channel: 'dm' | 'guild') {
    return (cls: ExtendableCls<CustomCommand>): any => {
        abstract class Extended extends cls {
            channel = channel;
        }
        return Extended;
    };
}

export const requireGuild = _requireChannel('guild');
export const requireDM = _requireChannel('dm');
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

function _hasCustomPermissions() {
    return (cls: ExtendableCls<CustomCommand>): any => {
        abstract class Extended extends cls {
            public readonly requireCustomPermissions = true;
        }

        return Extended;
    };
}
export const hasCustomPermissions = _hasCustomPermissions();

export function requireDefaultPermissions(perms: PermissionString[]) {
    return (cls: ExtendableCls<CustomCommand>): any => {
        abstract class Extended extends cls {
            public userPermissions = perms;

        }

        return Extended;
    };
}
