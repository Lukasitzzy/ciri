import { MessageEmbed } from 'discord.js';
import { GuildCommandContext } from '../../../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../../../packages/core/src/commands/CustomCommand';
import { applyOptions, requireDefaultPermissions } from '../../../../../packages/util/decorators';
import { GuildModerationDocument } from '../../../../../packages/util/typings/settings';

@requireDefaultPermissions(['MANAGE_GUILD'])
@applyOptions({
    id: 'settings.guilds.automod.enable',
    description: {
    },

    options: {}
})
export default class EnableGuildAutomodCommand extends CustomCommand {



    async run(ctx: GuildCommandContext<Record<string, unknown>>): Promise<unknown> {
        await ctx.guild.settings.sync();
        const data = (ctx.guild.settings.get<GuildModerationDocument>('security'));
        if (!data) {
            return ctx.send(`${ctx.emote('error')} failed to the database`);
        }
        if (data?.automod.enabled) {
            return ctx.send(`${ctx.emote('info')} the automod is already enabled `);
        }
        data.automod.enabled = true;

        const bool = await ctx.guild.settings.update({ key: 'security', data: data });
        if (bool) {
            return ctx.send(
                `${ctx.emote('success')} successfully enabled the automod. ${!data.enabled ?
                    'But since the security option is currently disabled, I will not take action' : ''
                }`);
        }

    }




    public help(prefix: string): MessageEmbed {
        const embed = new MessageEmbed();

        return embed;
    }
}
