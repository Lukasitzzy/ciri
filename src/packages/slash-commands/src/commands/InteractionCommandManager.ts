import chalk = require('chalk');
import { DiscordAPIError } from 'discord.js';
import { EventEmitter } from 'events';
import { DiscordBot } from '../../../core/src/client/Client';
import { getApi } from '../../../util/Functions';
import { InteractionClient } from '../Client/Client';
import { IApplicationCommandDataPost } from '../types/Discord.js.Api';
import { IApplicationCommand, IApplicationCommandOption } from '../types/InteractionTypes';

export class InteractionCommandManager extends EventEmitter {

    private readonly _client: InteractionClient;
    private readonly _discordClient: DiscordBot;
    public constructor(client: InteractionClient, bot: DiscordBot) {
        super({ captureRejections: true });
        this._client = client;
        this._discordClient = bot;
    }

    async create(options: {
        options: {
            name: string;
            description: string;
            options: IApplicationCommandDataPost['options'];
        };
        guildID?: string;
    }): Promise<IApplicationCommand | null> {
        const id = await this._client.getApplicationID();
        if (id) {
        if (options.guildID) {
            return getApi(this._discordClient)
                .applications(id)
                .guilds(options.guildID)
                .commands.post({ data: options.options });
        }

        return getApi(this._client.client)
            .applications(id).commands.post({ data: options.options });
    } else {
        return null;
    }
    }

    async edit(
        commandID: string,
        name: string,
        description: string,
        options: IApplicationCommandOption[],
        guildID?: string
    ): Promise<{
        success: boolean;
        data: null | IApplicationCommand;
        error?: Error;
    }> {
        try {
            const id = await this._client.getApplicationID();
            if (id) {
            if (guildID) {
                const data = await getApi(this._client.client)
                    .applications(id)
                    .guilds(guildID)
                    .commands(commandID)
                    .patch({
                        data: {
                            name,
                            description,
                            options,
                        }
                    });
                if (data) {
                    return {
                        success: true,
                        error: undefined,
                        data
                    };
                }
            }
            const data = await getApi(this._client.client)
                .applications(id)
                .commands(commandID)
                .patch({
                    data: {
                        name,
                        description,
                        options,
                    }
                });
            if (data) {
                return {
                    success: true,
                    error: undefined,
                    data
                };
            }

            return {
                success: false,
                data: null,
                error: undefined
            };
        } else {
            return {
                data: null,
                success: false,
                error: undefined
            };
        }
        } catch (error) {
            if (error instanceof DiscordAPIError) {
                if (error.code === 10063) {
                    throw new Error(`this command does not exist${guildID ? ' on your guild' : ' globally'}`);
                }
                return {
                    success: false,
                    data: null,
                    error
                };
            } else {
                return {
                    success: false,
                    data: null,
                    error
                };
            }
        }
    }

    async delete(
        command: string,
        guild?: string,

    ): Promise<void> {
        const id = await this._client.getApplicationID();
        if (id) {
        if (guild) {
            await getApi(this._discordClient)
                .applications(id)
                .guilds(guild)
                .commands(command)
                .delete();
        }
        await getApi(this._discordClient)
            .applications(id)
            .commands
            .delete();
    }
    }

    async fetchCommand(command: string, guild?: string): Promise<IApplicationCommand | null> {
        const id = await this._client.getApplicationID();
        if (id) {
        if (guild) {
            return getApi(this._client.client)
                .applications(id)
                .guilds(guild)
                .commands(command)
                .get();
        }
        return getApi(this._client.client)
            .applications(id)
            .commands(command)
            .get();
    } else {
        return null;
    }
    }


    async addCommands({
        data,
        guildID
    }: {
        data: IApplicationCommandDataPost[];
        guildID?: string;
    }): Promise<IApplicationCommand[]> {
        const oldCommands = await this.fetch(guildID);
        const newarr = [...oldCommands || [], ...data];
        return this.bulkCreateCommands({
            data: newarr,
            guildID
        });
    }

    async bulkCreateCommands({
        data,
        guildID
    }: {
        data: IApplicationCommandDataPost[];
        guildID?: string;
    }): Promise<IApplicationCommand[]> {
        const id = await this._client.getApplicationID();
        if (id) {

        const api = getApi(this._discordClient)
            .applications(id);
        if (guildID) {
            return api
                .guilds(guildID)
                .commands
                .put({ data });
        }
        return api
            .commands
            .put({ data });
    } else {
        return [];
    }
    }

    async fetch(guildID?: string): Promise<IApplicationCommand[]> {
        const id = await this._client.getApplicationID();
        if (id) {
            if (guildID) {
                return getApi(this._client.client)
                    .applications(id)
                    .guilds(guildID)
                    .commands
                    .get();
            } else {
                return getApi(this._client.client)
                    .applications(id)
                    .commands
                    .get();
            }
        } else {
            return [];
        }
    }
    async purge(guildID?: string): Promise<unknown> {
        const id = await this._client.getApplicationID();
        if (id) {
            const api = getApi(this._client.client).applications(id);
            if (guildID) {
                this.emit('debug', `purging commands for ${guildID}`);
                return api.guilds(guildID).commands.put({ data: [] });
            } else {
                this.emit('debug', chalk.bold.bgCyan.black`purging all commands!`);
                return api.commands.put({ data: [] });
            }
        }
    }

}
