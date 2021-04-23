import { Snowflake } from 'discord.js';

export interface BaseDocument {
    documentID: string;
    version: number;
    security: GuildModerationDocument; 
    createAt: number;
    updatedAt: number;
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





//#region users


export interface UserSettingsDbData {
    userID: string;
    bonkedCount: number;
    voteBannedCount: number;
    selfVotebannedCount: number;
}
