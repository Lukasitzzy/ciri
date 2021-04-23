import { GuildMember } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { GuildFeatures } from 'discord.js';
import { GuildCommandContext } from '../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../packages/core/src/commands/CustomCommand';
import { AitherGuild } from '../../../packages/extentions/Guild';
import { applyOptions, requireGuild } from '../../../packages/util/decorators';

@requireGuild
@applyOptions({
    id: 'info.server',
    description: {},
    options: {
        aliases: ['server-info', 'sinfo', 'serverinfo', 'guild'],
        channel: 'guild',
        args: [{
            id: 'test',
            flag: ['--test']
        }]
    }
})
export default class ServerInfoCommand extends CustomCommand {

    async run(ctx: GuildCommandContext<Record<'test', boolean>>): Promise<void> {

        if (!ctx.guild) {

            return;
        }
        const guild = await ctx.guild.fetch() as AitherGuild;

        if (!guild) {
            await ctx.send(`${ctx.emote('error')} failed to fetch information.`);
            return;
        }
        const owner: GuildMember = await guild.fetchOwner();
        const members = await guild.members.fetch({ force: guild.memberCount !== guild.members.cache.size });

        const features = this._parseFeatures(ctx, ctx.guild as AitherGuild, guild.features);
        const online = members.filter(member => member.presence.status === 'online').size;
        const { level, ammount } = await this._fetchBoostingLevel(guild);
        const BOOSTER_LEVEL_EMOTE = level ? ctx.emote(`server_boost_level_${level}` as 'server_boost_level_0') : '';
        const str = [
            `server information for ${guild.name}`,
            `${ctx.emote('server_member')} ${ctx.guild.memberCount} member${ctx.guild.memberCount == 1 ? '' : 's'} | ${ctx.emote('member_online')} online ${online} `,
            `server region: ${guild.region.toLowerCase().replace(/-/g, ' ').replace(/_/g, ' ')}`,
            `${ctx.emote('server_owner')} owner: ${owner.user.tag}`,
            'more info',
            `${guild.channels.cache.size
            } channel${guild.channels.cache.size === 1 ? '' : 's'
            } | ${guild.roles.cache.size} ${guild.roles.cache.size === 1 ? '' : 's'
            } | ${guild.emojis.cache.size} ${guild.emojis.cache.size === 1 ? '' : 's'
            }`,
            level ? `${BOOSTER_LEVEL_EMOTE} **Booster**: Level ${level} (${ammount} boosts)` : '',
            `ID: ${guild.id}`,
            features.length ? `server features:\n${features.join(', ')}` : '',
        ].filter(item => !!item).join('\n');
        const icon = guild.iconURL() || undefined;
        const embed = new MessageEmbed()
            .setColor(owner.displayHexColor || 0x00f00f)
            .setFooter(`requested by ${ctx.author.tag}`)
            .setTimestamp(Date.now() + 64000)
            .setDescription(str);

        if (icon) {
            embed.setThumbnail(icon);
        }


        await ctx.msg.util?.send(embed);
        return;
    }

    private async _fetchBoostingLevel(guild: AitherGuild): Promise<{
        level: 0 | 1 | 2 | 3 | null;
        ammount: number | null;
    }> {

        if (!guild) {
            return {
                level: 0,
                ammount: 0
            };
        }

        if (guild.premiumSubscriptionCount !== null && guild.premiumTier !== null) {
            return {
                level: guild.premiumTier,
                ammount: guild.premiumSubscriptionCount
            };
        }

        guild = await guild.fetch() as AitherGuild;


        if (guild.premiumSubscriptionCount && guild.premiumTier) {
            return {
                level: guild.premiumTier,
                ammount: guild.premiumSubscriptionCount
            };
        }
        else {
            return {
                level: 0,
                ammount: 0
            };
        }



    }

    private _parseFeatures(
        ctx: GuildCommandContext<Record<string, unknown>>,
        guild: AitherGuild,
        features: GuildFeatures[],
    ) {

        const list: string[] = [];
        if (!features.length) {
            return [];
        }
        for (const feature of features) {
            switch (feature) {
                case 'COMMUNITY':
                    list.push(`${ctx.emote('server_community')} community `);
                    break;
                case 'PARTNERED':
                    list.push(`${ctx.emote('server_partnered')} partnered`);
            }
        }
        if (guild.partnered && !features.includes('PARTNERED')) list.push(`${ctx.emote('server_partnered')} partnered`);
        return list;

    }


    public help(prefix: string): MessageEmbed {

        const embed = new MessageEmbed();
        embed.setDescription(`usage: ${prefix}serverinfo`);
        return embed;
    }

}
