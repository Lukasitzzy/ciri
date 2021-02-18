import { Listener } from 'discord-akairo';
import { DiscordBot } from '../../../packages/core/src/client/Client';
import { getApi } from '../../../packages/slash-commands/src/Client/Client';
declare module 'discord.js' {
    interface PresenceData {
        activities: {
            type: ActivityType,
            name: string,
            utl?: string;
        }[];
    }
}

export default class ClientReadyEvent extends Listener {
    client!: DiscordBot;
    constructor() {
        super('client.ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    async exec(): Promise<void> {
        this.client.interaction.on('new', async (command, guild) => {
            await command.reply('success!', { ephemeral: true });
        });

        const g = this.client.guilds.cache.random();
        if (g) {
            const whooks = g.fetchWebhooks();
            const f = (await whooks).first();
            if (f) {
                const api = getApi(this.client);
                api.webhooks(web);
            }
        }
        this.client.user?.setPresence({
            activities: [{
                name: 'with 0.0.1% mmath knowledge',
                type: 'PLAYING'
            }],
            status: 'dnd'
        });
        console.log(`[READY] ${this.client.user?.tag} is now ready. `);
    }
}