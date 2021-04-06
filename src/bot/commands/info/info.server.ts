import { TextChannel, GuildFeatures, MessageEmbed } from 'discord.js';
import { MongoServerSelectionError } from 'mongodb';
import { CommandContext, TextbasedChannel } from '../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../packages/core/src/commands/CustomCommand';
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
        
        if (!ctx.guild) return;
        const guild = await ctx.guild.fetch();
        const {
            premiumSubscriptionCount,
            premiumTier,
            features: ServerFeatures,
            name,
            id,
            createdAt,
            description,
            explicitContentFilter,
            verified
        } = guild;
        const embed = this.client.util.embed().setColor('RANDOM');
        const features = this._parseFeatures(ctx, ServerFeatures);

    }

    private _parsePremiumSubscriptionCount(subs: number, tier: 0 | 1 | 2 | 3) {}

    private _parseFeatures(
        ctx:  CommandContext<Record<string, undefined>, TextbasedChannel>,
        features: GuildFeatures[], 
    ) {

        const list: string[] = [];
        if (!features.length) {
            return [];
        }
        for (const feature of features) {
            switch (feature) {
                case 'COMMUNITY':
                    list.push(ctx.emote('server_community'));
                    break;
                case 'PARTNERED':
                    list.push(ctx.emote('server_partnered'));
                default:
                    break;
            }
        }
        return list;

    }

}
