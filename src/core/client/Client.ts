import { AkairoClient } from 'discord-akairo';
import { Intents } from 'discord.js';

/**
 * the client that connects to the discord Websocket
 * @extends {AkairoClient}
 */
export class DiscordBotClient extends AkairoClient {

    /**
     * 
     */
    readonly #root: string;

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
        this.#root = ROOT;
    }

    /**
     * 
     */
    public async start(): Promise<void> {
        await this.login();
    }

}