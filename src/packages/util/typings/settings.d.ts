import { Snowflake } from 'discord.js';
import { ObjectID } from 'mongodb';

export interface BaseDocument {
    documentID: ObjectID;
    version: number;
    security: GuildModerationDocument; 
}



export interface GuildSettingsDocument extends BaseDocument{
    guildID: Snowflake;
    allowSlashCommands: boolean;
    prefix: string;

}

export interface GuildModerationDocument {
    enabled: boolean;
    automod: GuildAutomod;
}


export interface GuildAutomod {
    enabled: boolean;
    filters: GuildFilter;
}

export interface GuildFilter {
    enabled: boolean;
    messages: GuildFilterMessage;
}

export interface GuildFilterMessage {
    enabled: boolean;
    invites: boolean;
    
}

export interface GuildFilterName {
    enabled: boolean;
    names: readonly string[];
    actions: ('BAN' | 'KICK')[];

}

export type GuildModerationActionsHard = 'BAN' | 'KICK';




