import { AkairoClient } from 'discord-akairo';
import { Intents } from 'discord.js';
import { join } from 'node:path';
import { CustomCommandHandler } from '../commands/CommandHandler';
import { CustomCommand } from '../commands/CustomCommand';

export class DiscordBot extends AkairoClient {

    public commandHandler: CustomCommandHandler<CustomCommand>;

    /**
     *
     */
    constructor(root: string) {
        super({
            ownerID: process.env.OWNER_ID?.split('--'),
            intents: Intents.ALL
        });

        this.commandHandler = new CustomCommandHandler(this, {
            directory: join(root, 'commands'),
            handleEdits: true,
            commandUtil: true,
            prefix: '$'
        });
    }

    private _prepare(): void {
        this.commandHandler.loadAll();
    }
}
