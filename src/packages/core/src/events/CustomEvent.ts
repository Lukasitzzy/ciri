import { Listener, ListenerOptions } from 'discord-akairo';

export class CustomEvent extends Listener {


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