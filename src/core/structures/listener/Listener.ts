import { Listener, ListenerOptions } from 'discord-akairo';
import { DiscordBotClient } from '../../client/Client';


export class CustomListener extends Listener {
    public client!: DiscordBotClient;

    /**
     *
     */
    constructor({
        id,
        options
    }: {
        id: string;
        options: ListenerOptions;
    }) {
        super(id, options);
    }
}