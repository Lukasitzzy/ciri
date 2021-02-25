import { CommandContext, TextbasedChannel } from '../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../packages/core/src/commands/CustomCommand';

export default class PingCommand extends CustomCommand {
    constructor() {
        super({
            id: 'ping',
            description: {},
            options: {
                aliases: ['ping']
            }
        });

    }

    public async run(ctx: CommandContext<Record<string, unknown>, TextbasedChannel>): Promise<any> {
        const m = await ctx.util?.send('pinging....');
        if (!m) return false;

        const diff = (m.editedTimestamp || m.createdTimestamp) - (ctx.msg.editedTimestamp || ctx.msg.createdTimestamp);

        const ping = this.client.ws.ping;

        await m.edit(`PONG! message ping \`${diff}\`ms | Websocket ping \`${ping}\`ms `);
    }

}
