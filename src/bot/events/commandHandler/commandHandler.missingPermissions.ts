import { Message } from 'discord.js';
import { CommandContext } from '../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../packages/core/src/commands/CustomCommand';
import { CustomEvent } from '../../../packages/core/src/events/CustomEvent';


export default class MissingPermissionsEvent extends CustomEvent {
    /**
     *
     */
    constructor() {
        super({
            id: 'client.commandHandler.missingPermissions',
            options: {
                event: 'missingPermissions',
                emitter: 'commandHandler',
                category: 'client.commandHandler'
            }
        });

    }

    async run(msg: Message,command: CustomCommand, type: 'client' | 'user'): Promise<Message | void> {

        const ctx = new CommandContext<Record<string, any>, typeof msg['channel']>(msg, command, {});

        if (type === 'user') {
            return ctx.send('you don\'t have the permission to use this command.');
        }

        if (type === 'client') {
            this.client.logger.log(`did not have the permission to run the "${command.id}" command`);
            return ctx.send('i don\'t have the permission to run the command');
        }
    }
}
