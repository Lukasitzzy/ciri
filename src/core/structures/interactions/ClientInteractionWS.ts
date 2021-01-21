/* eslint-disable no-fallthrough */
/* eslint-disable no-case-declarations */
import { Guild } from "discord.js";
import fetch from "node-fetch";
import { EventEmitter } from "ws";
import { DiscordBotClient } from "../../client/Client";
import { InteractionCommand } from "./commands/InteractionCommand";
import { InteractionResponseType, InteractionType, VERSION } from "./InteractionConstants";
import { IWsResponse } from "./types";


export class ClientInteractionWS extends EventEmitter {

    private readonly $client: DiscordBotClient;
    readonly VERSION = VERSION;
    /**
     *
     */
    constructor(client: DiscordBotClient) {
        super({ captureRejections: true });

        this.$client = client;

    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get $Clientapi(): any {
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
                const interaction = new InteractionCommand(
                    this.$client,
                    data,
                    syncHandle
                );
                this.emit('create', interaction);
                return pr;
            default:
                throw new Error('invalied interaction data');
        }
    }

    async handleFromGateWay(data: IWsResponse): Promise<void> {
        const handleRes = await this.$handle(data);


        const URL = `https://discord.com/api/v8/interactions/${data.id}/${data.token}/callback`;

        const res = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                type: 4,
                data: data
            })
        }
        ).catch((erro: Error) => {
            console.log(`failed to respond to command "${data.data.name}" Reason: ${erro}`);
        });
    }

    on(event: 'create', handler: (interaction: InteractionCommand) => void): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(event: string, handler: (...data: any[]) => void): this {
        return super.on(event, handler);
    }
}