import { CustomCommand } from '../../../packages/core/src/commands/CustomCommand';
import { CustomEvent } from '../../../packages/core/src/events/CustomEvent';

export default class CommandLoadEvent extends CustomEvent {
    /**
     *
     */
    constructor() {
        super({
            id: 'client.commandHandler.load',
            options: {
                event: 'load',
                emitter: 'commandHandler',
                category: 'client.commandHandler'
            }
        });

    }

    async run(command: CustomCommand, reload?: boolean): Promise<void> {
        this.client.logger.debug(`command ${command.id} has been ${reload ? 're' : ''} loaded`, this.id);
    }
}
