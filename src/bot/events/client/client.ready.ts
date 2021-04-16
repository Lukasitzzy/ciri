import { DiscordBot } from '../../../packages/core/src/client/Client';
import { CustomEvent } from '../../../packages/core/src/events/CustomEvent';
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


        this.client.logger.shards = this.client.ws.shards.size > 1 ?
            this.client.ws.shards.map(s => s.id)
        : [0, 1];
        
        if (!process.env.DISABLE_DB) {
            
            await this.client.db.checkGuilds(this.client);
        }

        if (process.env.TWITCH_URL) {

            this.client.user?.setPresence({
                activities: [{
                    name: `${process.env.TWITCH_URL}`,
                    type: 'STREAMING',
                    url: process.env.TWITCH_URL

                }],
                status: 'dnd'
            });
            
        } else {
            this.client.user?.setPresence({
                activities: [{
                    name: 'use $help for help',
                    type: 'PLAYING'
                }],
                status: 'dnd'
            });
        }

        this.client.logger.log(`${this.client.user?.tag} is now ready. `, this.id);

    }
}
