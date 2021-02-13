import { AkairoClient, Command, CommandHandler, CommandHandlerOptions } from 'discord-akairo';
import { Collection } from 'discord.js';


export class CustomCommandHandler<CMD extends Command> extends CommandHandler {

    public modules!: Collection<string, CMD>;
    constructor(client: AkairoClient, options: CommandHandlerOptions) {
        super(client, options);

    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    findCommand(name: string): CMD | undefined {
        return (
            this.modules.get(name) ||
            this.modules.find(c => c.id === name || c.aliases && c.aliases.includes(name))
        ) as CMD | undefined;
    }
}