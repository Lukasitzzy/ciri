import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { Intents } from 'discord.js';
import { join } from 'path';



/**
 * the client that connects to the discord Websocket
 * @extends {AkairoClient}
 */
export class DiscordBotClient extends AkairoClient {

    public commandHandler: CommandHandler;
    public listenerHandler: ListenerHandler;
    public inhibitorHandler: InhibitorHandler;

    /**
     *
     */
    public constructor(ROOT: string) {
        super({
            ownerID: process.env.OWNER_ID?.split(','),
        }, {
            ws: {
                intents: [Intents.ALL]
            },
            http: {
                version: 8
            }
        });

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

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: join(ROOT, 'inhibitors')
        });

    }

    /**
     * 
     */
    public async start(): Promise<void> {

        this.$prepare();
        this.listenerHandler.loadAll();

        await this.login();
    }

    private $prepare() {
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            websocket: this.ws
        });

        this.commandHandler.on('commandBlocked', (m, c, r) => {
            console.log(`blocked command "${c.id}" reason: ${r}`);

        });
        this.commandHandler
            .useListenerHandler(this.listenerHandler)
            .useInhibitorHandler(this.inhibitorHandler)
            .loadAll();
    }

}