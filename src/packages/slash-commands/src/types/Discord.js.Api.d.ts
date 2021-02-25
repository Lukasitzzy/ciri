import * as types from './InteractionTypes';
interface DiscordApiSendPost<T> {
    data: T;
    query?: {
        wait: boolean;
    };
}


export interface Api {
    applications(id: string): ApplicationApi;
    interactions(id: string, token: string): InteractionApi;
    webhooks(id: string, token: string): {
        post({ data }: {
            data: {
                content: string;
            },
            auth?: boolean;
            query?: {
                wait: boolean;
            };
        }): Promise<any>;
        messages(id: string): {
            get(): Promise<any>;
            post(data: any): Promise<any>;
            delete(): Promise<any>;
        };
    };
}


export interface InteractionApi {
    callback: {
        post(data: DiscordApiSendPost<{
            data: {
                content: string;
                flags?: number;
                type: number;
            };
        }>): Promise<any>;
    };
}
export interface WebhookApi {
    get(): Promise<any>;
}

export interface ApplicationApi {

    // guilds: any;
    commands: CommandsApi;
    guilds: GuildApi;

}

interface GuildApi {
    (guildID: string): {
        commands: CommandsApi,
    };

}

export interface CommandsApi {
    (commandid: string): CommandApi;
    get(): Promise<types.IApplicationCommand[]>;
    delete(options: any): Promise<void>;
    post(data: DiscordApiSendPost<IApplicationCommandDataPost>): Promise<types.IApplicationCommand>;
    put<T>(data: DiscordApiSendPost<T>): Promise<void>;
}

export interface IApplicationCommandDataPost {
    name: string;
    description: string;
    options?: types.IApplicationCommandOption[];
}
interface CommandApi {
    get(): Promise<types.IApplicationCommand>;



}

interface MethodApi<T, data> {
    get(): Promise<T>;
    patch(data: data): Promise<T>;
    delete(): Promise<T>;
}


export interface commandsApi {
    (commandID: string): {
        get(): Promise<any>;
        patch(): Promise<any>;
        delete(): Promise<any>;
    };
}
