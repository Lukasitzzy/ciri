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
const defaultPrefix = process.env.DISCORD_COMMAND_PREFIX || '$';
export class DiscordBot extends AkairoClient {

    public readonly commandHandler: CustomCommandHandler<CustomCommand>;
    public readonly listenerHandler: ListenerHandler;
    public readonly inhibitorHandler: InhibitorHandler;
    public readonly interaction: InteractionClient;
    public readonly logger: Logger;
    public readonly db: Database;
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
            prefix: async (msg): Promise<string> => {
                if (msg.guild) {
                    const settings = this.db.settings.cache.get(msg.guild?.id) || await this.db.settings
                        .collection.findOne({ guild_id: msg.guild.id });
                    if (!settings) return defaultPrefix;
                    return settings.prefix;
                } else {
                    return defaultPrefix;
                }
            }
        });


        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: join(root, 'inhibitors')
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: join(root, 'events')
        });

        this.interaction = new InteractionClient(this);


        const SHARDS: number[] = [];

        if (this.ws.shards.size) {
            for (const shard of this.ws.shards.values()) SHARDS.push(shard.id);
        }


        this.logger = new Logger();
        this.db = new Database({
            appname: process.env.DATABASE_APP_NAME || 'christina',
            dbname: process.env.DATABASE_NAME || 'discord_bot',
            host: 'localhost',
            shards: SHARDS,
            port: 27017,
            auth: process.env.DATABASE_AUTH ?
                (() => {
                    const [user, pass] = process.env.DATABASE_AUTH.split(':<:>:');
                    return {
                        user,
                        password: pass
                    };
                })() : undefined
        });

    }

    async start(): Promise<void> {
        try {
            this._prepare();
            await this.db.connect();
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
