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
    version: number;
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
    links: IGuildSettingsAutomodFilterMessagesLinks;
    messages: IGuildSettingsAutomodFilterMessagesMessages;

}

export interface IGuildSettingsAutomodFilterMessagesInvite {
    enabled: boolean;
    messages: string[];
    allowed_invites: string[];

}
export interface IGuildSettingsAutomodFilterMessagesLinks {
    allowed_domains: string[];
    enabled: boolean;
    messages: string[];
}
export interface IGuildSettingsAutomodFilterMessagesMessages {
    enabled: boolean;
    messages: string[];
    regexps: string[];
}


export interface IGuildSettingsAutomodFilterNames {
    enabled: boolean;
    regexps: string[];
    action: 'KICK' |'BAN';
}


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
