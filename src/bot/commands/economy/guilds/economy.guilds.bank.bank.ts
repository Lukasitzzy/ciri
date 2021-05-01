import { MessageEmbed } from 'discord.js';
import { CommandContext, TextbasedChannel } from '../../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../../packages/core/src/commands/CustomCommand';
import { applyOptions, hasCustomPermissions, requireDefaultPermissions } from '../../../../packages/util/decorators';


@hasCustomPermissions
@requireDefaultPermissions(['ADMINISTRATOR'])
@applyOptions({
    id: 'economy.guilds.bank.bank',
    description: {
        text: 'changes the settings for the guild\'s bank',
        aliases: ['bank'],
        examples: ['{{prefix}}bank disable', '{{prefix}}bank currency'],
        usage: ['{{prefix}}bank <sub_command> {...options]']
    },
    options: {
        aliases: ['bank']
    }
})
export default class BankCommand extends CustomCommand {

    async run(ctx: CommandContext<any, TextbasedChannel>): Promise<unknown> {

        return ctx.send(`${ctx.emote('error')} command currently disabled`);

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
