import * as mongo from 'mongodb';
import { EMOTES } from '../../../../../util/Constants';
import { BaseModel } from '../../../base/BaseModel';
import { Database } from '../../../Database';
import { IGuildEconomySettings, ITaxSettings, IUserBankAccount } from '../../../util/economy';
const useCache = true;
export class GuildEconomyModel extends BaseModel<IGuildEconomySettings>  {


    constructor(db: Database, collection: mongo.Collection<IGuildEconomySettings>) {
        super(db, 'guild_id', collection);
    }
    /**
     * initialized the Database
     */
    async init(): Promise<void> {
        const all = await this.fetchAll();
        for (const data of all) {

            if (useCache) {
                this.cache.set(data.guild_id, data);
            }
        }

        this.db.logger.log(`${EMOTES.DEFAULT.success} successfully inited all guild.economy settings.`, `${this.name}`);

    }
    /**
     * fetches ALL settings out of the Datbase
     * @returns a Array of all settings
     */
    async fetchAll(): Promise<IGuildEconomySettings[]> {
        return this.collection.find().toArray();
    }
    /**
     * fetches a single document out of the database
     * @param guild_id the guild you want to search for
     * @returns the settings if any
     */
    async fetch(guild_id: string): Promise<IGuildEconomySettings | null> {
        return this.collection.findOne({ guild_id });
    }
    /**
     * get's the current cached guild settings 
     * @param guild_id the guild id you want to get the cache of
     * @returns the Settings if any
     */
    get(guild_id: string): IGuildEconomySettings | undefined {
        return this.cache.get(guild_id);
    }


    async createAccount(userid: string, guild_id: string, startVault = 15_000, isMain = false): Promise<IUserBankAccount | null | undefined> {
        const existing = this.get(guild_id) || await this.fetch(guild_id);
        if (!existing) return null;
        if (existing.bank.accounts.some(account => account.owner_id === userid)) {
            return existing.bank.accounts.find(account => account.owner_id === userid);
        }
        const account = {
            id: new mongo.ObjectID(Date.now()).toHexString(),
            locked: false,
            owner_id: userid,
            ismain: isMain,
            taxes: existing.bank.taxes,
            vault: startVault,
        };

        existing.bank.accounts.push(account);

        const res = await this.collection.updateOne({ guild_id }, { $set: existing }, { upsert: true });

        if (res.modifiedCount === 1) {
            this.cache.set(guild_id, existing);
            return account;
        } return null;
    }

    async deleteAccount(userid: string, guild_id: string): Promise<boolean> {
        const existing = this.get(guild_id) || await this.fetch(guild_id);

        if (!existing) return false;
        existing.bank.accounts = existing.bank.accounts.filter(v => v.owner_id !== userid); 
        const res = await this.collection.updateOne({ guild_id }, { $set: existing }, { upsert: true });
        if (res.modifiedCount === 1) {
            this.cache.delete(guild_id);
            return true;
            
        } 
        return false;
    }


    // -- do i allow negative taxations??
    async updateTaxes(guild_id: string, key: keyof ITaxSettings, value: number): Promise<IGuildEconomySettings | null> {
        const old = this.get(guild_id) || await this.collection.findOne({ guild_id });
        value = value / 100;
        if (!old) {
            return null;
        }
        if (old.bank.taxes[key] === value) return old;
        // we won't allow over taxations nor negative ones (currently)
        if (value > 1 || value < 0) return null;

        old.bank.taxes[key] = value;

        return this.collection.updateOne({ guild_id }, {
            $set: old
        }).then(response => {
            if (response.modifiedCount === 1) {
                this.cache.set(guild_id, old);
                return old;
            } else {
                return null;
            }
        });

    }

    async updateBankVault(guild_id: string, value: number): Promise<IGuildEconomySettings | null> {

        const old = this.get(guild_id) || await this.collection.findOne({ guild_id });

        if (!old) {
            return null;
        }
        
        old.bank.vault += value;
        return this.collection.updateOne({ guild_id }, { 
            $set: old
         }, { upsert: true })
         .then(response => {
             if (response.modifiedCount === 1) {
                this.cache.set(guild_id, old);
                return old;
             } else {
                 return null;
             }
         });

    }


}
