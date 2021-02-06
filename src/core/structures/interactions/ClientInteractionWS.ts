/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-case-declarations */

import { Guild } from 'discord.js';
import { EventEmitter } from 'ws';
import { DiscordBotClient } from '../../client/Client';
import { InteractionCommand } from './commands/InteractionCommand';
import { InteractionCommandHandler } from './commands/InteractionCommandManager';
import { CustomError } from './errors/CustomError';
import { InteractionResponseType, InteractionType, VERSION } from './InteractionConstants';
import { Api, DiscordApiSend, IApplicationCommand, IWsResponse } from './types';

export class ClientInteractionWS extends EventEmitter {

    private readonly $client: DiscordBotClient;

    commands: InteractionCommandHandler;
    /**
     * the version of the current build
     */
    readonly VERSION = VERSION;
    constructor(client: DiscordBotClient) {
        super({ captureRejections: true });

        this.$client = client;

        this.commands = new InteractionCommandHandler(this);

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
        return this.api.applications(this.client.user?.id ?? '').guilds(guild.id);
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
                    this,
                    data,
                    syncHandle
                );
                this.emit('new', interaction);
                return pr;
            default:
                throw new Error('invalied interaction data');
        }
    }

    async post<
        T extends Record<string, unknown>,
        Body extends Record<string, unknown> = Record<string, unknown>
    >({
        data,
        endpoint,
        guildID
    }: {
        data: Body,
        endpoint: 'guilds' | 'commands' | 'guild:commands' | 'callback';
        guildID?: string;
    }): Promise<T | null | undefined> {

        const API = this.$createAPI(endpoint, guildID);
        return API.post({ data });
    }


    async get<T>({
        endpoint,
        guildiD
    }: { endpoint: 'guilds' | 'commands' | 'guild:commands' | 'callback'; guildiD?: string; }): Promise<T> {
        const api = this.$createAPI(endpoint, guildiD);
        return api.get() as unknown as T;
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

    get interactionApi(): Api['applications'] {
        return this.api.applications;
    }

    get client(): DiscordBotClient {
        return this.$client;
    }


    private $createAPI<T>(
        endpoint: 'guilds' | 'commands' | 'guild:commands' | 'callback',
        guildID?: string
    ): {
        get(): Promise<T>;
        post<R>(data: DiscordApiSend<T>): Promise<R>;
        delete(data: DiscordApiSend<T>): Promise<void>;
        patch(data: DiscordApiSend<T>): Promise<void>;
    } {
        let api: any;
        switch (endpoint) {
            case 'guild:commands':
                if (guildID) {
                    api = this.interactionApi(this.client.user!.id).guilds(guildID);
                } else {
                    throw new Error('/guilds/:id/commands was called but no valid guild id was provided');
                }
                break;

            case 'callback':
                api = this.interactionApi(this.client.user!.id).callback;
                break;
            case 'commands':
                api = this.api.applications(this.client.user!.id).commands;
                break;
            case 'guilds':
                if (!guildID) throw new Error('/guilds/:id was called but no valid guild id was provided');
                api = this.api.applications(this.client.user!.id).guilds(guildID);
                break;
            default:
                api = {
                    async post(): Promise<any> {
                        return null;
                    }
                };
                throw new CustomError('INVALID_ENDPOINT', 'InvalidEndpointError', endpoint, ['guilds', 'commands', 'callback', 'guild:commands']);
        }
        return api;
    }
}