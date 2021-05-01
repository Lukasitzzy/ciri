import { MessageEmbed } from 'discord.js';
import { GuildCommandContext } from '../../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../../packages/core/src/commands/CustomCommand';
import { applyOptions, requireDefaultPermissions, hasCustomPermissions, requireGuild } from '../../../../packages/util/decorators';
const defaultPrefix = process.env.DEFAULT_PREFIX || '$';
@requireGuild
@hasCustomPermissions
@applyOptions({
    id: 'settings.guilds.prefix',
    description: {
        aliases: ['prefix'],
        examples: ['{{prefix}}prefix $'],
        usage: ['{{prefix}}prefix [prefix|reset]'],
        text: 'change or view the current prefix'
    },
    options: {
        aliases: ['prefix'],
        args: [{
            id: 'prefix',
            default: process.env.DEFAULT_PREFIX,
            type: (_, str) => str.length < 4 && str.trim().length ? str.trim() : null
        }],
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
        if (ctx.member.permissions.has('MANAGE_GUILD')) {
        const success = await ctx.guild.settings.update({ key: 'prefix', data: ctx.args.prefix });
        if (success) {
            return ctx.send(`${ctx.emote('success')} successfully updated the prefix to \`${ctx.args.prefix}\` `);
        } else {
            return ctx.send(`${ctx.emote('error')} something broke while running this command `);
        }
    } else {
        return ctx.send(
            `${ctx.emote('info')} this is already the current prefix. ${current === defaultPrefix ? '(default)' : ''
            }`
        );
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
