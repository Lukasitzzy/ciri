import { CustomEvent } from '../../../packages/core/src/events/CustomEvent';


export default class ClientErrorListener extends CustomEvent {
    constructor() {
        super({
            id: 'client.error',
            options: {
                emitter: 'client',
                event: 'error',
                category: 'client'
            }
        }
        );
    }

    run(data: Error): void {

        this.client.logger.error(data);
        return;
    }
}
