import { CustomCommand } from "../../../core/structures/commands/Command";
import { CommandContext } from "../../../core/structures/commands/CommandContext";


export default class BotInfoCommand extends CustomCommand {


    public async run(ctx: CommandContext<Record<string, unknown>>): Promise<unknown> {

        await ctx.say('test');

        return;
    }

}