
import { CustomCommand } from "../../../core/structures/commands/Command";
import { CommandContext } from "../../../core/structures/commands/CommandContext";
import { Guild } from "discord.js";
export default class TestCommand extends CustomCommand {

    /**
     *
     */
    constructor() {
        super({
            id: 'util.owner.test',
            options: {
                aliases: ['test'],
                ownerOnly: true,
                args: [{
                    id: 'guild',
                    default: null,
                    type: 'guild'
                }]
            }
        });

    }


    public async run(ctx: CommandContext<{ guild: Guild; }>): Promise<unknown> {
        await ctx.say('command disabled');
        return;
    }
}