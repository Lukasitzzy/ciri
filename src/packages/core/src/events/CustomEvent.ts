import { Listener, ListenerOptions } from 'discord-akairo';
import { DiscordBot } from '../client/Client';

export abstract class CustomEvent extends Listener {
    client!: DiscordBot;

    constructor({
        id,
        options
    }: {
        id: string;
        options: ListenerOptions;
    }) {
        super(id, options);
    }

    abstract run(...eventargs: any[]): any | Promise<any>;

    public async exec(...data: any[]): Promise<any> {
        try {
            await this.run?.(...data);
        } catch (error) {
            this.client.logger.error(error, this.id);
        }
    }
}
