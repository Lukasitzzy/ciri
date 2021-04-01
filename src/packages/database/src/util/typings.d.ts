import { Snowflake } from 'discord.js';

interface IBaseSettings {
    _id?: undefined;
    __v?: undefined;
}

export interface IGuildSettings extends IBaseSettings {
    /**
     * @required
     */
    guild_id: string;
    /**
     * @default_value true
     */
    allow_slash_commands: boolean;
    automod: IGuildSettingsAutomod;

    prefix: string;
}

export interface IGuildSettingsAutomod {
    enabled: boolean;
    filters: IGuildSettingsAutomodFilter;
}

export interface IGuildSettingsAutomodFilter {
    messages: IGuildSettingsAutomodFilterMessages;
    names: IGuildSettingsAutomodFilterNames
}

export interface IGuildSettingsAutomodFilterMessages {
    enabled: boolean;
    invites: IGuildSettingsAutomodFilterMessagesInvite;

}

export interface IGuildSettingsAutomodFilterMessagesInvite {}
export interface IGuildSettingsAutomodFilterMessagesImages {}
export interface IGuildSettingsAutomodFilterMessages {}


export interface IGuildSettingsAutomodFilterNames {}


export interface ISlashCommandGuildPermissions extends IBaseSettings {
    guild_id: string;
    slash_command:string;
    roles: Snowflake[];
    members: Snowflake[];
    channels: Snowflake[];
    enable: boolean;
    //always false for now
    use_language_model: boolean;
}
