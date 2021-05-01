import { Flag } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { GuildCommandContext } from '../../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../../packages/core/src/commands/CustomCommand';
import { AitherMessage } from '../../../../packages/extentions/Message';
import { applyOptions, hasCustomPermissions, requireDefaultPermissions } from '../../../../packages/util/decorators';
const VALID_SUB_COMMANDS = [
    'prefix',
    'automod'
];
@hasCustomPermissions
@requireDefaultPermissions(['MANAGE_GUILD'])
@applyOptions({
    id: 'settings.guild.settings',
    description: {
        aliases: ['settings'],
        examples: ['{{prefix}}settings welcome'],
        usage: ['{{prefix}}settings <option> [...value]'],
        text: 'change or view current server settings'
    },
    options: {
        aliases: ['settings'],
    }
})
export default class GuildSettingsCommand extends CustomCommand {


    public *args(): Generator<unknown> {

        const method = yield {
            type: [
                ['settings.guilds.prefix', 'prefix'],
                ['settings.guilds.automod', 'automod'] 
            ],
            otherwise: (msg: AitherMessage) => {
                const ctx = new GuildCommandContext(msg, this, {});
                return `${ctx.emote('error')} invalid options. please use one of the following ${VALID_SUB_COMMANDS.map(subCommand => ` \`${subCommand}\` `).join(', ')}. `;

            }
        };

        return Flag.continue(method as string);

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
