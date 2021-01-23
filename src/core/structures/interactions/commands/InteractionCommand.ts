import { DiscordBotClient } from "../../../client/Client";
import { Interaction } from "../Interaction";
import { IWsResponse } from "../types";
import { SnowflakeUtil, MessageOptions, APIMessage } from 'discord.js';
import fetch, { Headers } from "node-fetch";
import * as interactionsConstants from '../InteractionConstants';
export class InteractionCommand extends Interaction {
    private readonly $syncHandle: Record<string, (...args: unknown[]) => void>;
    private readonly $commandID: string;
    private readonly $options: IWsResponse['data']['options'];
    /**
     *
     */
    constructor(client: DiscordBotClient, data: IWsResponse, syncHandle: Record<string, (...args: any) => void>) {
        super(client, data);

        this.$syncHandle = syncHandle;
        this.$commandID = data.data.id;
        this.$options = data.data.options || [];

    }

    get createdTimestamp(): number {
        return SnowflakeUtil.deconstruct(this.id).timestamp;
    }

    get createdAt(): Date {
        return new Date(this.createdTimestamp);
    }

    async reply(content: string, options?: {
        ephemeral: boolean;
        options?: MessageOptions;
    }): Promise<void> {

        options = options || {
            ephemeral: false,
            options: {}
        };

        const URL = `https://discord.com/api/v8/interactions/${this.id}/${this.token}/callback`;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const apiMsg = APIMessage.create(this, content, options.options).resolveData() as { data: { content: string; flags: number; }; };
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
                type: !options?.ephemeral ? interactionsConstants.InteractionResponseType.ACKNOWLEDGE_WITH_SOURCE : interactionsConstants.InteractionResponseType.ACKNOWLEDGE,
                data: apiMsg.data,

            })
        }).then(async res => {
            // console.log(await res.json());

            // await console.log((await res.json()).errors._errors[0]);
        });
    }
}