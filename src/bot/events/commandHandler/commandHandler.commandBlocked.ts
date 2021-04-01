import { Message } from 'discord.js';
import { CustomCommand } from '../../../packages/core/src/commands/CustomCommand';
import { CustomEvent } from '../../../packages/core/src/events/CustomEvent';

export default class CommandBlockedEvent extends CustomEvent {
    /**
     *
     */
    constructor() {
        super({
            id: 'client.commandHandler.commandBlocked',
            options: {
                event: 'commandBlocked',
                emitter: 'commandHandler',
                category: 'client.commandHandler'
            }
        });

    }

    async run(_: Message,command: CustomCommand): Promise<void> {
        this.client.logger.debug(`command ${command.id} blocked`, this.id);
    }
}
