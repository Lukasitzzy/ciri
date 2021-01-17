import { GuildFeatures } from "discord.js";
import { CustomCommand } from "../../../core/structures/commands/Command";
import { CommandContextNoArgs } from "../../../core/structures/commands/CommandContext";


export default class ServerInfoCommand extends CustomCommand {

    /**
     *
     */
    constructor() {
        super({
            id: 'info.info.serverinfo',
            options: {
                aliases: ['serverinfo', 'sinfo', 'guild'],
                channel: 'guild'
            }
        });

    }

    async run(ctx: CommandContextNoArgs): Promise<unknown> {

        const guild = await ctx.guild?.fetch();

        if (!guild || !guild.available) {
            return ctx.say('could not find that information about this server.');
        }

        const boostTier = guild.premiumTier,
            boostCount = guild.premiumSubscriptionCount,
            categoryChannels = guild.channels.cache.filter(channel => channel.type === 'category'),
            emotes = guild.emojis.cache.array(),
            features = this.$parseFeatures(guild.features),
            first10Emotes = emotes.slice(0, 10),
            ID = guild.id,
            members = await guild.members.fetch(),
            name = guild.name,
            newsChannels = guild.channels.cache.filter(channel => channel.type === 'news'),
            owner = await guild.members.fetch(guild.ownerID),
            region = guild.region.toLocaleLowerCase(),
            rulesChannel = guild.rulesChannel,
            security = guild.verificationLevel,
            storeChannels = guild.channels.cache.filter(channel => channel.type === 'store'),

            textChannels = guild.channels.cache.filter(channel => channel.type === 'text'),
            voiceChannels = guild.channels.cache.filter(channel => channel.type === 'voice');

        const str = [`Name: ${name} (ID)`].join('\n'), ;
        return;
    }

    private $parseFeatures(features: GuildFeatures[]) {
        const newFeature: string[] = [];
        for (const feature of features) {
            switch (feature) {
                case 'PARTNERED':
                    newFeature.push('partner');
                    break;

                default:
                    break;
            }
        }
    }

    private $getEmoteFromBoostLevel($boostlevel: number) {

        if ($boostlevel === 0) {
            return '';
        } else if ($boostlevel === 1) {
            return '';
        } else if ($boostlevel === 2) {
            return '';
        } else if ($boostlevel === 3) {
            return '';
        }
        return '';
    }
}