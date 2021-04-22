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
    description: {},
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

        return embed;
    }

}
