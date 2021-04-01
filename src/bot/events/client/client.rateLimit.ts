import { RateLimitData } from 'discord.js';
import { CustomEvent } from '../../../packages/core/src/events/CustomEvent';


export default class ClientRatelimitListener extends CustomEvent {
    constructor() {
        super({
            id: 'client.rateLimit',
            options: {
                emitter: 'client',
                event: 'rateLimit',
                category: 'client'
            }
        }
        );
    }

    run(data: RateLimitData): void {

        this.client.logger.debug(` hit ratelimit on "${data.route}"  (remaining: ${data.timeout}${data.limit})`, this.id);
        return;
    }
}
