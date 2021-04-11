import { Database } from '../../Database';
import { IGuildSettings } from '../../../../util/typings/settings';
import * as mongo from 'mongodb';
import { EMOTES } from '../../../../util/Constants';
import { BaseModel } from '../../base/BaseModel';
import { GuildSettingsAutomodModel } from './automod/Automod';
const useCache = true;
export class GuildSettingsModel extends BaseModel<IGuildSettings> {


    private readonly _automod: GuildSettingsAutomodModel;

    constructor(db: Database, collection: mongo.Collection<IGuildSettings>) {
        super(db, 'guild_id', collection);

        this._automod =  new GuildSettingsAutomodModel(this);
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

        await this._automod.init();

        this.db.logger.log(`${EMOTES.DEFAULT.success} successfully inited all guild settings.`, `${this.name}`);

    }
    /**
     * fetches ALL settings out of the Datbase
     * @returns a Array of all settings
     */
    async fetchAll(): Promise<IGuildSettings[]> {
        return this.collection.find().toArray();
    }
    /**
     * fetches a single document out of the database
     * @param guild_id the guild you want to search for
     * @returns the settings if any
     */
    async fetch(guild_id: string): Promise<IGuildSettings | null> {
        return this.collection.findOne({ guild_id });
    }
    /**
     * get's the current cached guild settings 
     * @param guild_id the guild id you want to get the cache of
     * @returns the Settings if any
     */
    get(guild_id: string): IGuildSettings | undefined {
        return this.cache.get(guild_id);
    }

    /**
     * 
     * @param options.guild_id the guild id you want to search for
     * @returns the prefix if any
     */
    async getPrefix({ guild_id }: { guild_id: string; }): Promise<string | undefined | null> {
        return this.cache.get(guild_id)?.prefix || this.collection.findOne({ guild_id }).then(res => res?.prefix);
    }
    async resetPrefix(guild_id: string): Promise<IGuildSettings | undefined> {
        return this.updatePrefix(guild_id, process.env.DEFAULT_PREFIX || '$');
    }
    async updatePrefix(guildID: string, prefix: string): Promise<IGuildSettings | undefined> {
        const oldSettings = this.get(guildID) || await this.fetch(guildID);

        if (!oldSettings) return undefined;

        oldSettings.prefix = prefix;

        return this.collection.updateOne({
            guild_id: guildID
        }, {
            $set: oldSettings
        }, { upsert: true }).then(res => {
            if (res.modifiedCount === 1) {
                this.cache.set(guildID, oldSettings);
                return oldSettings;
            }
        });
    }


    get automod(): GuildSettingsAutomodModel {
        return this._automod;
    }
}
