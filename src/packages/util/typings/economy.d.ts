import { Snowflake } from 'discord.js';
import { BaseDocument } from './settings';

export interface GuildEconomyDocument extends BaseDocument {
    guildID: Snowflake;
    enabled: boolean;
    bank: Bank;
    prefix: string;
    
}

export interface Bank {
    vault: number;
    taxes: {
        
    }
}


export interface UserAccount {
    idHash: string;
    vault: number;
    accountID: string;
    bankID: string;
    accountNumber: number;
    tax: {
        income: number;
        outgoing: number;
        keeping: number;
    }
}


export interface UserEconomySettings {
    cash: number;
    mainAccount?: UserAccount;
    accounts: UserAccount[];
}
