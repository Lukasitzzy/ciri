import { Inhibitor, InhibitorOptions } from 'discord-akairo';
import { DiscordBotClient } from '../../client/Client';


export class CustomInhibitor extends Inhibitor {

    public client!: DiscordBotClient;

    /**
     *
     */
    constructor({
        id,
        options
    }: {
        id: string;
        options: InhibitorOptions;
    }) {
        super(id, options);
    }
}