import { AkairoClient, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { Intents } from 'discord.js';
import { join } from 'path';
import { CustomCommandHandler } from '../commands/CommandHandler';
import { CustomCommand } from '../commands/CustomCommand';
import { InteractionClient } from '../../../slash-commands/src/Client/Client';
import { Logger } from '../logger/Logger';
const allowRegexPrefix = process.env.ALLOW_REGEX_PREFIX;
const defaultPrefix = process.env.DISCORD_COMMAND_PREFIX || '$';
import { Message } from 'discord.js';
export class DiscordBot extends AkairoClient {

    public readonly commandHandler: CustomCommandHandler<CustomCommand>;
    public readonly listenerHandler: ListenerHandler;
    public readonly inhibitorHandler: InhibitorHandler;
    public readonly interaction: InteractionClient;

    public readonly logger: Logger;
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
            prefix: (msg: Message): string => {
                if (!allowRegexPrefix) return defaultPrefix;
                const prefixMatch = msg.content.split(/\s+/g).slice(0, 2).join(' ')
                    ?.match(/hey\sCiri/gi);
                console.log(prefixMatch);
                if (prefixMatch) {
                    return 'hey ciri';
                }
                return defaultPrefix;
            }
        });

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: join(root, 'inhibitors')
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: join(root, 'events')
        });

        this.interaction = new InteractionClient(this);


        this.logger = new Logger(this.ws.shards.map(shard => shard.id));

    }

    async start(): Promise<void> {
        try {
            this._prepare();
            await this.login();
        } catch (error) {
            this.logger.error(error);

        }
    }

    private _prepare(): void {

        this.commandHandler
            .useInhibitorHandler(this.inhibitorHandler)
            .useListenerHandler(this.listenerHandler)
            .loadAll();
        this.listenerHandler.setEmitters({
            client: this,
            commandHandler: this.commandHandler,
            ws: this.ws
        });
        this.listenerHandler.loadAll();
        // this.inhibitorHandler.loadAll();
    }
}
