import { Snowflake } from 'discord.js';
import { BaseDocument } from './settings';

export interface GuildEconomyDocument extends BaseDocument {
    guildID: Snowflake;
    enabled: boolean;
    bank: any;
    prefix: string;
    
}

export interface Bank {
    vault: number;
    taxes: {
        
    }
}

