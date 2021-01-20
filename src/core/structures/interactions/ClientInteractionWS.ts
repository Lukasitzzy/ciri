/* eslint-disable no-fallthrough */
/* eslint-disable no-case-declarations */
import { Guild } from "discord.js";
import { EventEmitter } from "ws";
import { DiscordBotClient } from "../../client/Client";
import { InteractionResponseType, InteractionType } from "./InteractionConstants";
import { IWsResponse } from "./types";


export class ClientInteractionWS extends EventEmitter {

    private readonly $client: DiscordBotClient;

    /**
     *
     */
    constructor(client: DiscordBotClient) {
        super({ captureRejections: true });

        this.$client = client;

    }


    private get $Clientapi() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return this.$client.api.applications(this.$client.user?.id);
    }
    private $guildApi(guild: Guild) {
        return this.$Clientapi.guilds(guild.id);
    }


    private async $handle(data: IWsResponse): Promise<{ type: number; }> {
        switch (data.type) {
            case InteractionType.PING:
                return {
                    type: InteractionResponseType.PONG
                };
            case InteractionType.APPLICATION_COMMAND:
                let timedOut = false;
                let resolve: (value: { type: number; }) => void;

                const pr = new Promise<{ type: number; }>((r) => {
                    resolve = r;

                    this.$client.setTimeout(() => {
                        timedOut = true;
                        r({
                            type: InteractionResponseType.ACKNOWLEDGE_WITH_SOURCE
                        });
                    }, 250);

                });
                const syncHandle = {
                    ack({ hideSource }: { hideSource: boolean; }) {
                        if (!timedOut) {
                            resolve({
                                type: hideSource
                                    ? InteractionResponseType.ACKNOWLEDGE
                                    : InteractionResponseType.ACKNOWLEDGE_WITH_SOURCE

                            });
                        }
                    },
                    reply(resolved: { hideSource: boolean; }) {
                        if (timedOut) {
                            return false;
                        }
                        resolve({
                            type: resolved.hideSource
                                ? InteractionResponseType.ACKNOWLEDGE
                                : InteractionResponseType.ACKNOWLEDGE_WITH_SOURCE
                        });
                    }
                };
                return pr;
            default:
                throw new Error('invalied interaction data');
        }
    }


    async handleFromGateWay(data: IWsResponse): Promise<void> {
        const res = await this.$handle(data);
        await this.$Clientapi.interactions(data.id, data.token).callback.post({
            data: res
        });
    }
}