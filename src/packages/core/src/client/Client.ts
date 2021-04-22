import { AkairoClient, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { Intents } from 'discord.js';
import { join } from 'path';
import { CustomCommandHandler } from '../commands/CommandHandler';
import { CustomCommand } from '../commands/CustomCommand';
import { InteractionClient } from '../../../slash-commands/src/Client/Client';
import { Logger } from '../logger/Logger';
import { Database } from '../../../database/src/Database';
import { getApi } from '../../../util/Functions';
import { ClientApplication } from 'discord.js';
// import { EconomyManager } from '../../../economy/src/EconomyManager';
import { guildFunction } from '../../../extentions/Guild';
import { userFunction } from '../../../extentions/User';
import messageFunction, { AitherMessage } from '../../../extentions/Message';
const defaultPrefix = process.env.DISCORD_COMMAND_PREFIX || '$';

guildFunction();
userFunction();
messageFunction();

export class DiscordBot extends AkairoClient {

    public readonly commandHandler: CustomCommandHandler<CustomCommand>;
    public readonly listenerHandler: ListenerHandler;
    public readonly inhibitorHandler: InhibitorHandler;
    public readonly interaction: InteractionClient;
    // public readonly economy: EconomyManager;
    public readonly logger: Logger;
    public readonly db: Database;
    /**
     *
     */
    constructor(root: string) {

        super({
            ownerID: process.env.OWNER_ID?.split('--'),
            intents: Intents.ALL,
            http: {
                version: 8
            }
        });
        this.commandHandler = new CustomCommandHandler(this, {
            directory: join(root, 'commands'),
            handleEdits: true,
            commandUtil: true,
            automateCategories: true,

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore -- ts you suck with your strict 'don\'t extend types kthx' 
            prefix: async (msg: AitherMessage): Promise<string> => {
                if (msg.guild) {
                    if (!process.env.DISABLE_DB) {
                        await msg.guild.settings.sync();
                        const prefix = msg.guild.settings.get<string>('prefix');
                        if (!prefix) return defaultPrefix;
                        return prefix;
                    } else {
                        return defaultPrefix;
                    }
                } else {
                    return defaultPrefix;
                }
            }
        });


        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: join(root, 'inhibitors'),
            automateCategories: true
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: join(root, 'events')
        });

        this.interaction = new InteractionClient(this, join(root, 'slash_commands'));


        const SHARDS: number[] = [];

        if (this.ws.shards.size) {
            for (const shard of this.ws.shards.values()) SHARDS.push(shard.id);
        }


        this.logger = new Logger();
        this.db = new Database(this, {
            appname: process.env.DATABASE_APP_NAME || 'aither',
            auth: process.env.DATABASE_AUTH ?
                (() => {
                    const [user, password] = process.env.DATABASE_AUTH.split(':<:>:');
                    return {
                        user,
                        password
                    };
                })() : undefined,
            dbname: process.env.DATABASE_NAME || 'discord_bot',
            host: 'localhost',
            port: 27017,
            shards: SHARDS,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });


        // this.economy = new EconomyManager(this, this.db.economy);

    }

    async start(): Promise<void> {
        try {
            this._prepare();

            await this.db.init();
            await this.interaction.loadCommands();
            await this.login();
        } catch (error) {
            this.logger.error(error);

        }
    }

    async fetchApplication(): Promise<ClientApplication> {
        const data = await getApi(this)
            .oauth2
            .applications('@me')
            .get();
        return new ClientApplication(this, data);

    }

    private _prepare(): void {

        this.listenerHandler.setEmitters({
            client: this,
            commandHandler: this.commandHandler,
            ws: this.ws
        });
        this.listenerHandler.loadAll();
        this.commandHandler
            .useInhibitorHandler(this.inhibitorHandler)
            .useListenerHandler(this.listenerHandler)
            .loadAll();


        // this.inhibitorHandler.loadAll();
    }
}
