import { DiscordBot } from '../../../packages/core/src/client/Client';
import { CustomEvent } from '../../../packages/core/src/events/CustomEvent';
import { IWSResponse } from '../../../packages/util/typings/InteractionTypes';

export default class INTERACTION_CREATE_EVENT extends CustomEvent {
    client!: DiscordBot;
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

    async run(data: IWSResponse): Promise<void> {
        this.client.logger.debug(`received slash command ${data.data.name}`, this.id);
        console.log(this._sanities(data));
        
        await this.client.interaction.handle(data);

    }

    private _sanities(d: any): any {
        if (d) {
            const copy = {...d, token: null};
            return copy;
        } return d;
    }
}
