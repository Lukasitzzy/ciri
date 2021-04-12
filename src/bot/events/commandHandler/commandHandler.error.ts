import { Message } from 'discord.js';
import { CustomCommand } from '../../../packages/core/src/commands/CustomCommand';
import { CustomEvent } from '../../../packages/core/src/events/CustomEvent';

export default class CommandErrorEvent extends CustomEvent {
    /**
     *
     */
    constructor() {
        super({
            id: 'client.commandHandler.error',
            options: {
                event: 'error',
                emitter: 'commandHandler',
                category: 'client.commandHandler'
            }
        });
    }

    async run(err: Error, msg: Message, command: CustomCommand | null): Promise<void> {

        this.client.logger.error(err, command?.id || 'commandhandler');
    }
}
