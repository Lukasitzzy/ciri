import { GuildMember } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { TextChannel, GuildFeatures } from 'discord.js';
import { CommandContext, TextbasedChannel } from '../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../packages/core/src/commands/CustomCommand';
import { ChristinaGuild } from '../../../packages/extentions/Guild';
import { applyOptions } from '../../../packages/util/Functions';

@applyOptions({
    id: 'info.server',
    description: {},
    options: {
        aliases: ['server-info', 'sinfo', 'serverinfo', 'guild'],
        channel: 'guild'
    }
})
export default class ServerInfoCommand extends CustomCommand {


    async run(ctx: CommandContext<Record<string, undefined>, TextChannel>): Promise<void> {

        if (!ctx.guild){
            console.log('server goes brrrrrrrr');
            
             return;
        }
        const guild = await ctx.guild.fetch();
        console.log('brrrr');
        
        if (!guild) {
            await ctx.send(`${ctx.emote('error')} failed to fetch information.`);
            return;
        }
        let owner: GuildMember;
        if (!ctx.guild.owner) {
		owner = await ctx.guild.members.fetch(ctx.guild.ownerID);
	} else {
		owner = ctx.guild.owner;
	}

        const members = await guild.members.fetch({ force: guild.memberCount !== guild.members.cache.size});

        const features = this._parseFeatures(ctx, ctx.guild as ChristinaGuild, guild.features);
        const online = members.filter(member => member.presence.status === 'online').size;

        const str = [
            `server information for ${guild.name}`,
            `${ctx.emote('server_member')} ${ctx.guild.memberCount} member${ctx.guild.memberCount == 1 ? '': 's'} | ${ctx.emote('member_online')} online ${online} `,
            `server region: ${guild.region.toLowerCase().replace(/-/g, ' ').replace(/_/g, ' ')}`,
            `${ctx.emote('server_owner')} owner: ${owner.user.tag}`,
            'more info',
            `${
                guild.channels.cache.size
            } channel${
                guild.channels.cache.size=== 1 ? '' : 's'
            } | ${guild.roles.cache.size} ${
                guild.roles.cache.size === 1 ? '' : 's'
            } | ${guild.emojis.cache.size} ${
                guild.emojis.cache.size === 1 ? '' : 's'
            }`,
            `ID: ${guild.id}`,
            features.length ? `server features:\n${features.join(', ')}` : '',
        ].join('\n');
        console.log('stuff');
        const icon = guild.iconURL() || undefined;
        const embed = new MessageEmbed()
        .setColor(guild.owner?.displayHexColor || 0x00f00f)
        .setFooter(`requested by ${ctx.author.tag}`)
        .setTimestamp(Date.now() + 64000)
        .setDescription(str);

        if (icon) {
            embed.setThumbnail(icon);
        }
        console.log('stuff2');
        console.log(!!ctx.msg.util);
        
        await ctx.msg.util?.send(embed);
        console.log('stuff3');
        return;
    }

    private _parseFeatures(
        ctx: CommandContext<Record<string, undefined>, TextbasedChannel>,
        guild: ChristinaGuild,
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

}
