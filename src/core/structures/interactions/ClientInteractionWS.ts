/* eslint-disable no-case-declarations */

import { Guild } from "discord.js";
import { EventEmitter } from "ws";
import { DiscordBotClient } from "../../client/Client";
import { InteractionCommand } from "./commands/InteractionCommand";
import { InteractionResponseType, InteractionType, VERSION } from "./InteractionConstants";
import { Api, IApplicationCommand, IWsResponse } from "./types";


export class ClientInteractionWS extends EventEmitter {

    private readonly $client: DiscordBotClient;
    /**
     * the version of the current build
     */
    readonly VERSION = VERSION;
    constructor(client: DiscordBotClient) {
        super({ captureRejections: true });

        this.$client = client;

    }

    /**
     * 
     * @param guild 
     */
    public guildApi(guild: Guild): {
        commands: {
            get(): Promise<IApplicationCommand[]>;
            post(data: {
                data: {
                    flags?: number;
                    content: string;
                };
            }): Promise<IApplicationCommand>;
        };
    } {
        return this.api.interactions(this.client.user?.id ?? '').guilds(guild.id);
    }

    /**
     * 
     * @param data 
     */
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
                const syncHandle: Record<string, (options: { hideSource: boolean; }) => void> = {
                    ack(options: { hideSource: boolean; }) {
                        if (!timedOut) {
                            resolve({
                                type: options.hideSource
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
                this.emit('new', interaction);
                return pr;
            default:
                throw new Error('invalied interaction data');
        }
    }

    /**
     * 
     * @param data 
     */
    async handleFromGateWay(data: IWsResponse): Promise<void> {
        await this.$handle(data);
    }

    on(event: 'new', handler: (interaction: InteractionCommand) => void): this;
    on(event: 'create', handler: (interaction: IApplicationCommand) => void): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(event: string, handler: (...data: any[]) => void): this {
        return super.on(event, handler);
    }
    get api(): Api {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return this.$client.api;
    }

    get client(): DiscordBotClient {
        return this.$client;
    }
}