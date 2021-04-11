import { Snowflake } from 'discord.js';

export interface IWSResponse {
    channel_id: string;
    id: string;
    guild_id?: string;
    data: iWsResponseData;
    member?: IPartialInteractionMember;
    token: string;
    type: number;
    version: string;

}

interface iWsResponseData {
    id: string;
    options?: iWsResponseData[];
    name: string;
    value?: string | number | boolean;
    description?: string;
    resolved?: IwsReponseDataResolved;
}

interface IwsReponseDataResolved {
    users?: Record<string, any>;
    members?: Record<string, any>;
    channels?: Record<string, any>;
    roles?: Record<string, any>;
}
interface IWSReponseDataOptions {
    value: string;
    type: number;
    name: string;
}
interface IPartialInteractionUser {
    avatar: string;
    discriminator: string;
    id: string;
    public_flags: number;
    username: string;

}
interface IPartialInteractionMember {
    deaf: boolean;
    is_pending: boolean;
    joined_at: string;
    mute: boolean;
    nick: string | null;
    pending: boolean;
    permissions: string;
    premium_since: number | null;
    roles: Snowflake[];
    user: IPartialInteractionUser;
}
export interface iWsResponseDataOptions {
    type: number;
    name: string;
    description: string;
    default?: boolean;
    required?: boolean;
    choices: IapplicationCommandOptionChoice[];
}

interface IapplicationCommandOptionChoice {
    name: string;
    value: any;
}

interface IApplicationCommandOption {
    type: number;
    name: string;
    description: string;
    // default true
    required: boolean;
    choices: IapplicationCommandOptionChoice[];
    options: IApplicationCommandOption[];
}

interface IApplicationCommand {
    id: string;
    application_id: string;
    description: string;
    name: string;
    options?: IApplicationCommandOption[];
}
