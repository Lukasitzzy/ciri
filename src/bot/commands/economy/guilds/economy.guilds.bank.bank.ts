import { MessageEmbed } from 'discord.js';
import { CommandContext, TextbasedChannel } from '../../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../../packages/core/src/commands/CustomCommand';
import { applyOptions, hasCustomPermissions, requireDefaultPermissions } from '../../../../packages/util/decorators';


@hasCustomPermissions
@requireDefaultPermissions(['ADMINISTRATOR'])
@applyOptions({
    id: 'economy.guilds.bank.bank',
    description: {},
    options: {
        aliases: ['bank']
    }
})
export default class BankCommand extends CustomCommand {

    async run(ctx: CommandContext<any, TextbasedChannel>): Promise<unknown> {
// 
        return ctx.send(`${ctx.emote('error')} command currently disabled`);



    }

    

    public help(prefix: string): MessageEmbed {
        const embed = new MessageEmbed();
        const {
            text: description,
            aliases,
        } = this.description;
        embed.setDescription([
            '**description**:',
            description,
            ...[aliases.length ? `**aliases**:  ${aliases.map(alias => `\`${prefix}${alias}\``).join('\n')}` : '']
        ].join('\n'));

        return embed;
    }


}
