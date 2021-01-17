import { CustomCommand } from "../../../core/structures/commands/Command";
import { CommandContext } from "../../../core/structures/commands/CommandContext";
import * as os from 'os';
import * as discord from 'discord.js';
import * as akairo from 'discord-akairo';
export default class BotInfoCommand extends CustomCommand {
    /**
     *
     */
    constructor() {
        super({
            id: 'util.info.binfo',
            options: {
                aliases: ['botinfo', 'info', 'binfo']
            }
        });

    }

    public async run(ctx: CommandContext<Record<string, unknown>>): Promise<unknown> {
        await ctx.say('fetching info....');
        const memory = this.$getMemory();
        const usage = this.$getPercentage(memory.max, memory.totalUsed);
        const stats: string[] = [
            `**Memory**: (${memory.used}mb/${(memory.max / 1024).toFixed(2)}GB ( ${usage}% used))`,
            `stats: ${this.client.guilds.cache.size} Server${this.client.guilds.cache.size === 1 ? '' : 's'} | ${this.client.channels.cache.size} channels | ${this.client.users.cache.size} users.`,
            '',
            `Developer ${this.client.users.cache.get(process.env.DISCORD_OWNER_ID ?? '')?.tag || 'unknown'}`,
            `Library [discord.js v${discord.version}](https://github.com/discordjs/discord.js)  framework: [discord-akairo v${akairo.version}](https://github.com/discord-akairo/discord-akairo)`
        ];
        const embed = this.client.util.embed().setColor(this.$getColorFromUsage(usage)).setDescription(stats.join('\n'));
        await ctx.say('', embed);
        return;
    }

    private $getPercentage(total: number, min: number) {
        return +(min / total).toFixed(2);
    }

    private $getColorFromUsage(usage: number): string {
        if (!usage) return 'DEFAULT';
        if (usage < 30) return 'GREEN';
        if (usage < 60) return 'YELLOW';
        if (usage < 90) return 'RED';
        return 'BLACK';
    }
    private $getMemory(): {
        max: number;
        totalUsed: number;
        used: number;
    } {

        const usedByBot = +(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalmem = +(os.totalmem() / 1024 / 1024).toFixed(2);
        const totalUsed = +((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(2);
        return {
            max: totalmem,
            totalUsed,
            used: usedByBot
        };
    }
}