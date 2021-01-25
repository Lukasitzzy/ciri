import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { Intents } from 'discord.js';
import { join } from 'path';
import { ClientInteractionWS } from '../structures/interactions/ClientInteractionWS';



/**
 * the client that connects to the discord Websocket
 * @extends {AkairoClient}
 */
export class DiscordBotClient extends AkairoClient {

    public commandHandler: CommandHandler;
    public listenerHandler: ListenerHandler;
    public inhibitorHandler: InhibitorHandler;

    public interactions: ClientInteractionWS;
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
                version: 7
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

        this.interactions = new ClientInteractionWS(this);

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
            ws: this.ws
        });

        this.commandHandler.on('commandBlocked', (m, c, r) => {
            console.log(`blocked command "${c.id}" reason: ${r}`);

        });

        this.interactions.on('new', async (data) => {
            console.log(`interaction create from user "${data.member?.user.id}"  command was ${data.id} `);
            await data.reply('test', { ephemeral: false });

        });
        this.commandHandler
            .useListenerHandler(this.listenerHandler)
            .useInhibitorHandler(this.inhibitorHandler)
            .loadAll();
    }

}