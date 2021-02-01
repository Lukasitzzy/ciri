import { CustomCommand } from '../../core/structures/commands/Command';
import { CommandContext } from '../../core/structures/commands/CommandContext';


export default class PingCommand extends CustomCommand {
    /**
     *
     */
    constructor() {
        super({
            id: 'util.ping',
            options: {
                aliases: ['ping']
            }
        });
    }
    public async run(ctx: CommandContext<Record<string, unknown>>): Promise<void> {
        const pingMessage = await ctx.say('pinging.....');
        const clientWSPing = this.client.ws.ping;
        await pingMessage.edit(
            `PONG! \`${clientWSPing}\`ms ( message \`${(
                pingMessage.editedTimestamp || pingMessage.createdTimestamp) -
            (ctx.msg.editedTimestamp || ctx.createdTimestamp)
            }\`ms )`);
    }

}