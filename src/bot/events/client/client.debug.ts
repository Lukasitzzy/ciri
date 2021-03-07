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
        if (message.match(/token/)) return;
        this.client.logger.debug(message, this.id);

        return;
    }
}
