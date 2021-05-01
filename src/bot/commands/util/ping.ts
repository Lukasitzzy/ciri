import { MessageEmbed } from 'discord.js';
import { CommandContext, TextbasedChannel } from '../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../packages/core/src/commands/CustomCommand';
import { applyOptions, hasCustomPermissions, requireDefaultPermissions } from '../../../packages/util/decorators';
@hasCustomPermissions
@requireDefaultPermissions(['SEND_MESSAGES'])
@applyOptions({
    id: 'ping',
    description: {
        text: 'get the bot latency to discord',
        aliases: ['ping'],
        examples: ['{{prefix}}ping'],  
        usage: ['{{prefix}}ping']
    },

    options: {
        category: 'util',
        aliases: ['ping'],
    }
})
export default class PingCommand extends CustomCommand {


    public async run(ctx: CommandContext<Record<string, unknown>, TextbasedChannel>): Promise<any> {
        const m = await ctx.util?.send('pinging....');
        if (!m) return false;

        const diff = (m.editedTimestamp || m.createdTimestamp) - (ctx.msg.editedTimestamp || ctx.msg.createdTimestamp);

        const ping = this.client.ws.ping;


        await m.edit(`PONG! message ping \`${diff}\`ms | Websocket ping \`${ping}\`ms `);
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
