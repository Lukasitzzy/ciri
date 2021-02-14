import { CustomEvent } from '../../../packages/core/src/events/CustomEvent';


export default class INTERACTION_CREATE_EVENT extends CustomEvent {
    /**
     *
     */
    constructor() {
        super({
            id: 'client.ws.INTERACTION_CREATE',
            options: {
                event: 'INTERACTION_CREATE',
                emitter: 'ws',
                category: 'client.ws'
            }
        });
    }

    async exec(data: { id: string; }): Promise<void> {
        console.log(data.id);
    }
}