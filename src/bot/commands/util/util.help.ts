import { Argument } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { CommandContext, TextbasedChannel } from '../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../packages/core/src/commands/CustomCommand';
import { applyOptions, hasCustomPermissions } from '../../../packages/util/decorators';
@hasCustomPermissions
@applyOptions({
    id: 'util.help',
    description: {
        text: 'get the bot latency to discord',
        aliases: ['help', 'h'],
        examples: ['{{prefix}}help', '{{prefix}}help help'],
        usage: ['{{prefix}}help [command]']
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

    public help(prefix: string): MessageEmbed {
        const embed = new MessageEmbed();
        const {text, aliases, usage, examples} = this.description;

        embed.setDescription([
            `**description**\n${text}`,
            `**aliases**: ${aliases.map(alias => `\`${alias}\``).join(' ')}`,
            usage.length ? `**usage**: ${usage.map(us => `\`${us.replace(/{{prefix}}/, prefix)}\``).join(' ')}` : '',
            examples.length ? `**examples**: ${examples.map((example) => `\`${example.replace(/{{prefix}}/, prefix)}\``).join(' ')}` : ''
        ].filter(f => f !== '').join('\n'));
        return embed;
    }
}
