
import { Util } from 'discord.js';
import { inspect } from 'util';
import { DiscordBot } from '../../../packages/core/src/client/Client';
import { CustomEvent } from '../../../packages/core/src/events/CustomEvent';
import { IWSResponse } from '../../../packages/slash-commands/src/types/InteractionTypes';

export default class INTERACTION_CREATE_EVENT extends CustomEvent {
    client!: DiscordBot;
    /**
     *
     */
    constructor() {
        super({
            id: 'client.ws.INTERACTION_CREATE',
            options: {
                event: 'INTERACTION_CREATE',
                emitter: 'ws',
                category: 'client.ws'
            }
        });
    }

    async exec(data: IWSResponse): Promise<void> {

        const _data = this._parsedata(data);

        const dataStr = inspect(_data, { depth: 0 });

        console.log(`[DEBUG] ws data: ${dataStr} `);

        console.log(`[DEBUG] received interaction command: ${data.data.name} `);

        await this.client.interaction.handle(data);

    }

    _parsedata<T extends { token: string; }>(data: { token: string; }): T {
        const r: any = Util.cloneObject(data) as T;
        r.token = null;
        return r as T;

    }
}