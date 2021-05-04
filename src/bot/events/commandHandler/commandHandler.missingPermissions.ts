import { CommandContext } from '../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../packages/core/src/commands/CustomCommand';
import { CustomEvent } from '../../../packages/core/src/events/CustomEvent';
import { AitherMessage } from '../../../packages/extension/Message';


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

    async run(msg: AitherMessage,command: CustomCommand, type: 'client' | 'user'): Promise<AitherMessage | void> {

        const ctx = new CommandContext<Record<string, any>, typeof msg['channel']>(msg, command, {});

        if (type === 'user') {
            return ctx.send(`${ctx.emote('error')} you don't have the permission to use this command.`);
        }

        if (type === 'client') {
            this.client.logger.log(`did not have the permission to run the "${command.id}" command`);
            return ctx.send(`${ctx.emote('error')} i don't have the permission to run the command`);
        }
    }
}
