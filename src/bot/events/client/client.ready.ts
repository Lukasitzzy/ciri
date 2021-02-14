import { Listener } from 'discord-akairo';


export default class ClientReadyEvent extends Listener {

    /**
     *
     */
    constructor() {
        super('client.ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    async exec(): Promise<void> {
        this.client.user?.setPresence({
            activity: {
                name: 'with 0.0.1% mmath knowledge',
                type: 'PLAYING'
            },
            status: 'dnd'
        });
    }
}