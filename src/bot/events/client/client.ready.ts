import { CustomEvent } from '../../../packages/core/src/events/CustomEvent';
export default class ClientReadyEvent extends CustomEvent {
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

        this.client.logger.shards = this.client.ws.shards.size ?
            this.client.ws.shards.map(s => s.id)
            : [0, 1];

        if (!process.env.DISABLE_DB) {
            await this.client.db.checkGuilds(this.client);
        } else {
            this.client.logger.debug('database is disabled. the bot may not work without it!');
        }

        if (process.env.TWITCH_URL) {

            this.client.user?.setPresence({
                activities: [{
                    name: 'mention me for help',
                    type: 'STREAMING',
                    url: process.env.TWITCH_URL

                }],
                status: 'dnd'
            });

        } else {
            this.client.user?.setPresence({
                activities: [{
                    name: 'mention me for help',
                    type: 'PLAYING'
                }],
                status: 'dnd'
            });
        }

        const invite = this.client.generateInvite({
            additionalScopes: [
                'applications.commands'
            ],
            permissions: [
                'SEND_MESSAGES',
                'USE_EXTERNAL_EMOJIS'
            ],
            disableGuildSelect: false
        });

        const str = [
            `${this.client.user?.username} is now ready`,
            'here are some stats',
            `Servers: ${this.client.guilds.cache.size}`,
            `channels: ${this.client.channels.cache.size}`,
            `emojis: ${this.client.emojis.cache.size}`,
            `users: ${this.client.users.cache.size}`,
            this.client.guilds.cache.size < 1 ? `invite the bot using ${invite}` : ''
        ].join('\n');

        this.client.logger.log(str);

    }
}
