import { DiscordBotClient } from "../../../client/Client";
import { Interaction } from "../Interaction";
import { IWsResponse } from "../types";
import { SnowflakeUtil, MessageOptions, APIMessage } from 'discord.js';
import fetch, { Headers } from "node-fetch";

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

    async reply(content: string, options?: MessageOptions) {


        const URL = `https://discord.com/api/v8/interactions/${this.id}/${this.token}/callback`;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const apiMsg = APIMessage.create(this, content, options).resolveData();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (Array.isArray(apiMsg.data?.content)) {
            throw new Error('message to long');
        }
        // const resolved = await apiMsg.resolveFiles();
        const id = this.client.user?.id || null;
        if (!id) {
            throw new Error('something fucked up');
        }
        console.log("test");
        const header = new Headers();
        header.append('Authorization', `Bot ${this.client.token}`);
        header.append('Content-Type', 'application/json');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        apiMsg.data.flags = 64;
        await fetch(URL, {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
                type: 4,
                data: apiMsg.data,

            })
        }).then(async res => {
            // console.log(await res.json());

            // await console.log((await res.json()).errors._errors[0]);
        });
    }
}