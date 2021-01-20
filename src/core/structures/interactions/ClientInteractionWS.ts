import { EventEmitter } from "ws";
import { DiscordBotClient } from "../../client/Client";


export class ClientInteractionWS extends EventEmitter {

    private readonly $client: DiscordBotClient;

    /**
     *
     */
    constructor(client: DiscordBotClient) {
        super({ captureRejections: true });

        this.$client = client;

    }


    private get $api() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return this.$client.api.applications(this.$client.user?.id);
    }
}