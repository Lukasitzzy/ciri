import { DiscordBot } from '../core/src/client/Client';
import { Api } from '../slash-commands/src/types/Discord.js.Api';

export function getApi(client: DiscordBot): Api {
    return Reflect.get(client, 'api');
}
