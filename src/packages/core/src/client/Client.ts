import { AkairoClient, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { Intents } from 'discord.js';
import { join } from 'path';
import { CustomCommandHandler } from '../commands/CommandHandler';
import { CustomCommand } from '../commands/CustomCommand';

export class DiscordBot extends AkairoClient {

    public readonly commandHandler: CustomCommandHandler<CustomCommand>;
    public readonly listenerHandler: ListenerHandler;
    public readonly inhibitorHandler: InhibitorHandler;
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

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: join(root, 'inhibitors')
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: join(root, 'events')
        });
    }

    async start(): Promise<void> {
        try {
            this._prepare();
            await this.login();
        } catch (error) {
            console.log(`error on startup ${error}`);

        }
    }

    private _prepare(): void {
        this.commandHandler
            .useInhibitorHandler(this.inhibitorHandler)
            .useListenerHandler(this.listenerHandler)
            .on('load', (command) => console.log(`loaded command ${command.id}`))
            .loadAll();
        this.listenerHandler.setEmitters({
            client: this,
            commandHandler: this.commandHandler,
            ws: this.ws
        });
        this.listenerHandler.on('load', (l) => {
            console.log(`loaded event ${l.event} on handler ${l.id}`);
        }).loadAll();
        // this.inhibitorHandler.loadAll();
    }
}
