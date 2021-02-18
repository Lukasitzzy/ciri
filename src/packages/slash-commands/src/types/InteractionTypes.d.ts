import { Guild } from 'discord.js';
import { Snowflake } from 'discord.js';
import { InteractionCommandHandlerEvents } from '../util/Constants';

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
    options: any[];
    name: string;
    description?: string;

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
export interface InterctionCommandHandlerEventHandlers {
    [InteractionCommandHandlerEvents.CREATE]: (command: IApplicationCommand, guild?: Guild) => void;
    [InteractionCommandHandlerEvents.DELETE]: (command: IApplicationCommand, guild?: Guild) => void;
    [InteractionCommandHandlerEvents.UPDATE]: (command: IApplicationCommand, guild?: Guild) => void;


}