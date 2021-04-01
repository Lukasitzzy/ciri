import { Message } from 'discord.js';
import { CustomCommand } from '../../../packages/core/src/commands/CustomCommand';
import { CustomEvent } from '../../../packages/core/src/events/CustomEvent';

export default class CommandStartedEvent extends CustomEvent {
    /**
     *
     */
    constructor() {
        super({
            id: 'client.commandHandler.commandStarted',
            options: {
                event: 'commandStarted',
                emitter: 'commandHandler',
                category: 'client.commandHandler'
            }
        });
    }

    async run(msg: Message,command: CustomCommand, args: Record<string, unknown>): Promise<void> {
        this.client.logger.commandRun(command, msg, args);
    }
}
