import { CustomListener } from "../../core/structures/listener/Listener";

export default class ReadyEvent extends CustomListener {
    /**
     *
     */
    constructor() {
        super({
            id: 'client.ready',
            options: {
                event: 'ready',
                emitter: 'client',
                category: 'client'
            }
        });
    }

    async exec(): Promise<void> {
        await this.client.user?.setPresence({
            status: 'dnd',
            activity: {
                name: 'with /help',
                type: 'PLAYING'
            }
        });
        console.log(`${this.client.user?.username} is now ready`);

    }
}