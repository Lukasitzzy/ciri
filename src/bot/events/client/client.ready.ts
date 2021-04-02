import { DiscordBot } from '../../../packages/core/src/client/Client';
import { CustomEvent } from '../../../packages/core/src/events/CustomEvent';
declare module 'discord.js' {
    interface PresenceData {
        activities: {
            type: ActivityType,
            name: string,
            utl?: string;
        }[];
    }
}

export default class ClientReadyEvent extends CustomEvent {
    client!: DiscordBot;
    constructor() {
        super({
            id: 'client.ready',
            options: {
                emitter: 'client',
                event: 'ready'
            }
        });
    }

    async run(): Promise<void> {

        this.client.user?.setPresence({
            activities: [{
                name: 'use /help for help',
                type: 'PLAYING'
            }],
            status: 'dnd'
        });
        this.client.logger.shards = this.client.ws.shards.size > 1 ?
            this.client.ws.shards.map(s => s.id)
            : [0, 1];
        await this.client.db.checkGuilds(this.client);
        this.client.logger.log(`${this.client.user?.tag} is now ready. `, this.id);

    }
}
