import { CommandOptions } from 'discord-akairo';
import { DiscordBot } from '../core/src/client/Client';
import { CustomCommand } from '../core/src/commands/CustomCommand';
import { Api } from '../slash-commands/src/types/Discord.js.Api';

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
