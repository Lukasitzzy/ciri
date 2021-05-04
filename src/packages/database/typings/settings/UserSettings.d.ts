import { Snowflake } from 'discord.js';


export interface IUserSettingsDocument {
    userID: Snowflake;
    profile: any;
    accounts: any[];
    mainAccount: any[];

}


export interface IUserSettingsProfileDocument {
    userID: string;
    details: string;
    inventory: any;
}


export interface IUserSettingsInventory {
    canTrade: boolean;
}
