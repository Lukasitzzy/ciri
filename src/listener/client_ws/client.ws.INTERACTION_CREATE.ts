import { IWsResponse } from "../../core/structures/interactions/types";
import { CustomListener } from "../../core/structures/listener/Listener";
export default class ReadyEvent extends CustomListener {
    constructor() {
        super({
            id: 'client.ws.interaction_create',
            options: {
                event: 'INTERACTION_CREATE',
                emitter: 'ws',
                category: 'client_ws'
            }
        });
    }

    async exec(data: IWsResponse): Promise<void> {
        await this.client.interactions.handleFromGateWay(data);
    }
}