import { CommandContext, TextbasedChannel } from '../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../packages/core/src/commands/CustomCommand';
import { applyOptions } from '../../../packages/util/Functions';

@applyOptions({
    id: 'ping',
    description: {
        text: 'get the bot latency to discord'
    },

    options: {
        category: 'util',
        aliases: ['ping']
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

}
