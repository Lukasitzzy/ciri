import { Listener } from 'discord-akairo';
import { RateLimitData } from 'discord.js';


export default class ClientRatelimitListener extends Listener {
    constructor() {
        super('client.rateLimit', {
            emitter: 'client',
            event: 'rateLimit',
            category: 'client'
        });
    }

    exec(data: RateLimitData): void {
        return;
    }
}
