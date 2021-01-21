import { Snowflake } from "discord.js";

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
    name: string;
    value: string;
}
