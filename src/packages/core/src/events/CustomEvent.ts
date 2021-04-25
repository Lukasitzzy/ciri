import { Listener, ListenerOptions } from 'discord-akairo';
import { AitherBot } from '../client/Client';

export abstract class CustomEvent extends Listener {
    client!: AitherBot;

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
