import { Argument } from 'discord-akairo';
import { CommandContext, TextbasedChannel } from '../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../packages/core/src/commands/CustomCommand';
import { applyOptions, hasCustomPermissions } from '../../../packages/util/decorators';
@hasCustomPermissions
@applyOptions({
    id: 'util.help',
    description: {
        text: 'get the bot latency to discord'
    },

    options: {
        category: 'util',
        aliases: ['help', 'h'],
        args: [{
            id: 'command',
            type: Argument.union('commandAlias', (_, arg) =>  arg.toLowerCase() === 'all' ? 'all' : null),
        }]
    }
})
export default class HelpCommand extends CustomCommand {


    public async run(ctx: CommandContext<{ command: CustomCommand | 'all' }, TextbasedChannel>): Promise<any> {

        const command = ctx.args.command;
        if (!command) {
            return;
        }

    }

}
