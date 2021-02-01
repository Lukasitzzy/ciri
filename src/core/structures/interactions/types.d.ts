import { StringResolvable } from 'discord.js';
import { Snowflake } from 'discord.js';

export interface IWsResponse {
    channel_id: string;
    id: string;
    guild_id?: string;
    data: IWsResponseData;
    member: IPartialInteractionMember;
    token: string;
    type: number;
    version: number;
}

export interface IPartialInteractionMember {
    deaf: boolean;
    is_pending: boolean;
    joined_at: string;
    mute: boolean;
    nick: string | null;
    pending: false;
    permissions: string;
    premium_since: null;
    roles: Snowflake[];
    user: IPartialInteractionUser;
}


export interface IPartialInteractionUser {
    avatar: string;
    discriminator: string;
    id: string;
    public_flags: number;
    username: string;
}

export interface IWsResponseData {
    options: IWsResponseDataOptions[];
    name: string;
    id: string;
}

export interface IWsResponseDataOptions {
    type: number;
    name: string;
    description: string;
    default?: boolean;
    required?: boolean;
    choices: IApplicationCommandOptionChoice[];
}

interface IApplicationCommandOptionChoice {
    name: string;
    value: string | number;
}

interface IApplicationCommandOption {
    type: number;
    name: string;
    description: string;
    required: boolean;
    choices: IApplicationCommandOptionChoice[];
    options: IApplicationCommandOption[];
}

interface DiscordApiSend<T> {
    data: T;
    query?: {
        wait: boolean;
    };
}

interface IApplicationCommand extends Record<string, any> {
    id: string,
    application_id: string;
    description: string;
    name: string;
    options?: IApplicationCommandOption[];
}
// TODO: fix this later
interface Api {
    applications(id: string): {
        commands: {
            get(): Promise<IApplicationCommand[]>;
            patch(data: DiscordApiSend<any>): Promise<IApplicationCommand>;
            delete(data: DiscordApiSend<any>): Promise<void>;
            post(data: DiscordApiSend<{
                name: string;
                description: string;
                options?: IApplicationCommandOption[];
            }>): Promise<IApplicationCommand>;
        };
        guilds(guildID: string): any;
        callback: {
            post<T>(options: {
                data: T;
            }): Promise<any>;
        };
    };
    webhooks(id: string, token: string): {
        messages(id: string): {
            get(): Promise<any>;
            post(data: any): Promise<any>;
            delete(): Promise<any>;
        };
    };
}