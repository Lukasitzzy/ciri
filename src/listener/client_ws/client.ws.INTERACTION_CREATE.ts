import { CustomListener } from "../../core/structures/listener/Listener";
export default class ReadyEvent extends CustomListener {
    /**
     *
     */
    constructor() {
        super({
            id: 'client.ws.interaction_create',
            options: {
                event: 'INTERACTION_CREATE',
                emitter: 'websocket',
                category: 'client_ws'
            }
        });
    }

    async exec(): Promise<void> {
        //
    }
}