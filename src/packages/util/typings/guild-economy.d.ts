import { ObjectID } from 'bson';
import { Snowflake } from 'discord.js';

interface BaseDocument {
    _id?: ObjectID;
}


export interface GuildEconomyDocument extends BaseDocument {
    guildID: Snowflake;
    enabled: boolean;
    bank: Bank;
    prefix: string;
    
}

export interface Bank {
    vault: number;
    taxes: {
        income: number;
        outgoing: number;
        keeping: number
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
    profile: UserProfile;
}

export enum ENUM_LANGUAGE_KEYS {
    EN_US= 'en-us',
    DE_DE= 'de-de'
}

export interface UserProfile {
    userID: string;
    details: string;
    preferedLanguage: ENUM_LANGUAGE_KEYS;
}


export interface UserProfileInventory {
    userID: string;
    items: [];
}

export interface UserProfileInventoryItem {
    name: string;
    count: number;
    slots: number; 
}
