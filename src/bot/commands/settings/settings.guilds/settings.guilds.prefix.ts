import { MessageEmbed } from 'discord.js';
import { GuildCommandContext } from '../../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../../packages/core/src/commands/CustomCommand';
import { applyOptions, requireDefaultPermissions, hasCustomPermissions } from '../../../../packages/util/decorators';
const defaultPrefix = process.env.DEFAULT_PREFIX || '$';
@hasCustomPermissions
@requireDefaultPermissions(['MANAGE_GUILD'])
@applyOptions({
    id: 'settings.guilds.prefix',
    description: {},
    options: {
        aliases: ['prefix'],
        args: [{
            id: 'prefix',
            default: process.env.DEFAULT_PREFIX,
            type: (_, str) => str.length < 4 && str.trim().length ? str.trim() : null
        }],
        channel: 'guild'
    }
})
export default class PrefixCommand extends CustomCommand {


    async run(ctx: GuildCommandContext<{ prefix: string; }>): Promise<unknown> {

        await ctx.guild?.settings.sync();
        const current = ctx.guild.settings.get<string>('prefix') || defaultPrefix;

        if (ctx.args.prefix === current) {
            return ctx.send(
                `${ctx.emote('info')} this is already the current prefix. ${current === defaultPrefix ? '(default)' : ''
                }`
            );

        }

        if (!ctx.args.prefix) {
            return ctx.send(
                `${ctx.emote('info')} the current prefix for this server is \`${current}\`. ${current === defaultPrefix ? '(default)' : ''
                }`
            );
        }

        const success = await ctx.guild.settings.update({ key: 'prefix', data: ctx.args.prefix });
        if (success) {
            return ctx.send(`${ctx.emote('success')} successfully updated the prefix to \`${ctx.args.prefix}\` `);
        } else {
            return ctx.send(`${ctx.emote('error')} something broke while running this command `);
        }
        return;
    }

    public help(prefix: string): MessageEmbed {
        const embed = new MessageEmbed();
        return embed;
    }


}
