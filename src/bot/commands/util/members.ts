import { CommandContext, TextbasedChannel } from '../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../packages/core/src/commands/CustomCommand';
import { applyOptions } from '../../../packages/util/decorators';

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
export default class MembersCommand extends CustomCommand {


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
                filtered.mobile[member.presence.clientStatus.mobile]++;

            }
            if (member.presence.clientStatus.web) {
                filtered.web[member.presence.clientStatus.web]++;

            }
        }
        const dndTotal = members.filter(member => member.presence.status === 'dnd').size;
        const idleTotal = members.filter(member => member.presence.status === 'idle').size;
        const onlineTotal = members.filter(member => member.presence.status === 'online').size;
        const offlineTotal = members.filter(member => member.presence.status === 'offline').size;

        const { mobile } = filtered;
        await ctx.send([
            `${ctx.emote('info')} current member stats:`,
            onlineTotal ? `online: ${onlineTotal} ${ctx.emote('member_online')}${mobile.online ? `( on mobile ${ctx.emote('mobile_online')} ${mobile.online})` : ''} ` : '',
            idleTotal ? `idle: ${idleTotal} ${ctx.emote('member_idle')}${mobile.idle ? `(on mobile ${ctx.emote('mobile_idle')} ${mobile.idle})` : ''}`: '',
            dndTotal ? `dnd: ${dndTotal} ${ctx.emote('member_dnd')}${mobile.dnd ? `( on mobile ${ctx.emote('mobile_dnd')} ${mobile.dnd})` : ''}`: '',
            offlineTotal ? `offline: ${offlineTotal} ${ctx.emote('member_offline')}${mobile.offline ? `( on mobile ${ctx.emote('member_offline')} ${mobile.offline})` : ''}` : '',

        ].filter(n => n !=='').join('\n'));

    }

}
