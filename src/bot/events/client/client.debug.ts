import { CustomEvent } from '../../../packages/core/src/events/CustomEvent';

export default class ClientRatelimitListener extends CustomEvent {
    constructor() {
        super({
            id: 'client.debug',
            options: {
                emitter: 'client',
                event: 'debug',
                category: 'client'
            }
        }
        );
    }

    run(message: string): void {
        if (process.env.DEBUG_MODE !== 'true') return;
        if (message.toLowerCase().match(/token/)) return;
        if (message.toLocaleLowerCase().includes('heart')) return;
        if (message.toLowerCase().includes('preparing to connect to the gateway...')) return;
        this.client.logger.debug(message, this.id);

        return;
    }
}
