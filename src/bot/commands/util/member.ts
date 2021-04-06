import { GuildMember } from 'discord.js';
import { CommandContext, TextbasedChannel } from '../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../packages/core/src/commands/CustomCommand';
import { applyOptions } from '../../../packages/util/Functions';

interface ClientStatusOptions {
    online: number;
    offline: number;
    dnd: number;
    idle: number;
}

@applyOptions({
    id: 'members',
    description: {
        text: 'get the bot latency to discord'
    },
    options: {
        category: 'util',
        aliases: ['members'],
        channel: 'guild'
    }
})
export default class MemberCommand extends CustomCommand {


    public async run(ctx: CommandContext<Record<string, unknown>, TextbasedChannel>): Promise<any> {

        if (!ctx.guild) return;
        await ctx.guild.members.fetch({ force: true });
        const members = ctx.guild.members.cache;
        const filtered: { web: ClientStatusOptions; mobile: ClientStatusOptions; desktop: ClientStatusOptions; } = {
            web: {
                online: 0,
                offline: 0,
                dnd: 0,
                idle: 0
            },
            desktop: {
                dnd: 0,
                idle: 0,
                offline: 0,
                online: 0
            },
            mobile: {
                dnd: 0,
                idle: 0,
                offline: 0,
                online: 0
            },
        };

        for (const member of members.array()) {
            if (!member.presence.clientStatus) continue;
            if (member.presence.clientStatus.desktop) {
                filtered.desktop[member.presence.clientStatus.desktop]++;
            }
            if (member.presence.clientStatus.mobile) {
                filtered.desktop[member.presence.clientStatus.mobile]++;

            }
            if (member.presence.clientStatus.web) {
                filtered.desktop[member.presence.clientStatus.web]++;

            }
        }
        const dndTotal = members.filter(member => member.presence.status === 'dnd');
        const idleTotal = members.filter(member => member.presence.status === 'idle');
        const onlineTotal = members.filter(member => member.presence.status === 'online');
        const offlineTotal = members.filter(member => member.presence.status === 'offline');

        const { web, desktop, mobile } = filtered;
        await ctx.send(`${ctx.emote('info')} current member stats:\n\n`);

    }

}
