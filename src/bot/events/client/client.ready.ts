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

        this.client.logger.log(`[READY] ${this.client.user?.tag} is now ready. `);
    }
}
