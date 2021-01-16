import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { Intents } from 'discord.js';
import { join } from 'path';

/**
 * the client that connects to the discord Websocket
 * @extends {AkairoClient}
 */
export class DiscordBotClient extends AkairoClient {

    public commandHandler: CommandHandler;
    /**
     * the root directory string 
     */
    private readonly root: string;
    public listenerHandler: ListenerHandler;

    /**
     *
     */
    public constructor(ROOT: string) {
        super({
            ownerID: process.env.OWNER_ID?.split(','),
        }, {
            ws: {
                intents: [Intents.ALL]
            }
        });
        this.root = ROOT;


        this.commandHandler = new CommandHandler(this, {
            directory: join(ROOT, 'commands'),
            prefix: process.env.DISCORD_COMMAND_PREFIX || '$',
            handleEdits: true,
            commandUtil: true,
            commandUtilLifetime: 3e5,
            commandUtilSweepInterval: 3e5 + 1
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: join(ROOT, 'listener')
        });
    }

    /**
     * 
     */
    public async start(): Promise<void> {
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
        });
        this.listenerHandler.loadAll();
        this.commandHandler.useListenerHandler(this.listenerHandler).loadAll();

        await this.login();
    }

}