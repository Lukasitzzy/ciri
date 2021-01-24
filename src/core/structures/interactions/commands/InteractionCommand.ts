import { DiscordBotClient } from "../../../client/Client";
import { Interaction } from "../Interaction";
import { IWsResponse } from "../types";
import { SnowflakeUtil, MessageOptions, APIMessage } from 'discord.js';
import fetch, { Headers } from "node-fetch";
import * as interactionsConstants from '../InteractionConstants';
/**
 * the command that was send via the websocket.
 */
export class InteractionCommand extends Interaction {

    private readonly $syncHandle: Record<string, (options: { hideSource: boolean; }) => void>;

    private readonly $commandID: string;

    private readonly $options: IWsResponse['data']['options'];
    /**
     * 
     * @param client the client that initialized the command
     * @param data the body of the websocket
     * @param syncHandle functions to handle
     */
    constructor(client: DiscordBotClient, data: IWsResponse, syncHandle: Record<string, (options: { hideSource: boolean; }) => void>) {
        super(client, data);

        this.$syncHandle = syncHandle;
        this.$commandID = data.data.id;
        this.$options = data.data.options || [];

    }

    /**
     * the timestamp the command was created.
     */
    get createdTimestamp(): number {
        return SnowflakeUtil.deconstruct(this.id).timestamp;
    }
    /**
     * the Dateobject of the {@link InteractionCommand#createdTimestamp}
     */
    get createdAt(): Date {
        return new Date(this.createdTimestamp);
    }
    /**
     * replies to the comnand Interaction.
     * @param content the message content you want to send
     * @param options options of the reply
     * @returns nothing.
     */

    async reply(content: string | string[], options?: {
        /**
         * whenever the message should only show client side (only the user is seeing it)
         */
        ephemeral: boolean;
        /**
         * the discord.js's message options
         */
        options?: MessageOptions;
    }): Promise<void> {


        if (Array.isArray(content)) content = content.join('\n');

        options = options || {
            ephemeral: false,
            options: {}
        };
        // TO-DO: remove that here
        const URL = `https://discord.com/api/v8/interactions/${this.id}/${this.token}/callback`;


        const apiMsg = APIMessage.create(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            this,
            content,
            options.options
        ).resolveData() as { data: { content: string; flags: number; }; };
        if (Array.isArray(apiMsg.data?.content)) {
            throw new Error('message to long');
        }
        const id = this.client.user?.id || null;
        if (!id) {
            throw new Error('something fucked up');
        }
        const header = new Headers();
        header.append('Authorization', `Bot ${this.client.token}`);
        header.append('Content-Type', 'application/json');
        if (options?.ephemeral) apiMsg.data.flags = 64;
        await fetch(URL, {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
                type: !options?.ephemeral ?
                    interactionsConstants.InteractionResponseType.ACKNOWLEDGE_WITH_SOURCE
                    : interactionsConstants.InteractionResponseType.ACKNOWLEDGE,
                data: apiMsg.data,

            })
        }).then(async res => {
            // console.log(await res.json());

            // await console.log((await res.json()).errors._errors[0]);
        });
    }
}