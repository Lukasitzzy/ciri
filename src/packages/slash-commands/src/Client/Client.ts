import { Guild } from 'discord.js';
import { EventEmitter } from 'events';
import { DiscordBot } from '../../../core/src/client/Client';
import { Api } from '../types/Discord.js.Api';

export class InteractionClient extends EventEmitter {

    private _started: boolean;

    private readonly _client: DiscordBot;

    public constructor(client: DiscordBot) {
        super({ captureRejections: true });
        this._started = false;
        this._client = client;

    }

    public enable(): void {
        this._started = true;
    }

    public disable(): void {
        this._started = false;
    }

    public async handle(data: any): Promise<void> {
        if (!data) return;
    }






    public on(event: 'new', handler: (interaction: any, guild?: Guild) => void): this;
    public on(event: string, handler: (interaction: any, guild?: Guild) => void): this {
        return super.on(event, handler);
    }


}

function getApi(client: any): Api {
    return Reflect.get(client, 'api');
}