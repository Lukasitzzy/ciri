import { IBaseSettings } from './settings';

export interface IGuildEconomySettings extends IBaseSettings {
    guild_id: string;
    bank: IBank;
    enabled: boolean;
}


export interface IBank {
    accounts: IUserBankAccount[];
    vault: number;
    owner_id: string;
    taxes: ITaxSettings;
}


export interface IBaseAccount {
    id: string;
    locked: boolean;

}
// bank.accounts[i]
export interface IUserBankAccount extends IBaseAccount {
    owner_id: string;
    password?: string;
    vault: number;
    ismain: boolean;
    taxes: ITaxSettings;

}
// user.account
export interface IGuildBankAccount extends IBaseAccount {
    is_primary: boolean;
}


interface ITaxSettings {
    sending: number;
    receiving: number;
    // account.vault++
    account_holding: number;
}


