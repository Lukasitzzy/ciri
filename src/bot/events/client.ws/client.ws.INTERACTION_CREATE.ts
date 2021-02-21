
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

    async run(data: IWSResponse): Promise<void> {
        await this.client.interaction.handle(data);

    }
}
