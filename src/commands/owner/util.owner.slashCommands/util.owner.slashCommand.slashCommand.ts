import { Command, Flag } from "discord-akairo";
import { Message } from "discord.js";

export default class slashCommand extends Command {
    /**
     *
     */
    constructor() {
        super(
            'util.owner.slashCommand',
            {
                aliases: ['slashcommand', 'sc'],
                ownerOnly: true
            });

    }

    public *args(): Generator<Record<string, unknown>> {

        const method = yield {
            type: [
                []
            ],
            otherwise: (msg: Message) => {
                return msg.util?.send(`this should be a help message.`);
            }
        };



        return Flag.continue(method as string);
    }
}