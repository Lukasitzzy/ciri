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
            content: string;
            flags?: number;
            type: number;
        }>): Promise<any>;
    };
}
export interface WebhookApi {
    get(): Promise<any>;
}

export interface ApplicationApi {
    callback: {
        post(
            data: any
        ): Promise<any>;
    };
}

type CommandApi = commandsApi | MethodApi<any, DiscordApiSendPost<types.IApplicationCommand>>;

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
