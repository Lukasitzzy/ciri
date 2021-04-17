import { Cache } from '../../../../../util/Cache';
import { EMOTES } from '../../../../../util/Constants';
// import { any } from '../../../../../util/typings/settings';
import { GuildSettingsModel } from '../GuildSettings';

export class GuildSettingsAutomodModel {

    public readonly cache: Cache<string, any>;

    private readonly _settings: GuildSettingsModel 
    /**
     *
     */
    constructor(settings: GuildSettingsModel) {
        this._settings = settings;

        this.cache = new Cache();
        
    }

    async fetchAll(): Promise<any[]> {
        return this._settings.fetchAll().then(data => data.map(settings => settings.security));
    }

    async fetch(guild_id: string): Promise<any | undefined | null> {
        return this._settings.fetch(guild_id).then(settings => settings?.security);
    }

    get(guild_id: string): any | undefined {
        return this.cache.get(guild_id);
    }

    async enable(guild_id: string): Promise<boolean| null> {
        const old = this._settings.get(guild_id) || await this._settings.fetch(guild_id);
        if (!old) return null;
        if (old.security.enabled) return true;
        old.security.enabled = true;
        const res = await this._settings.collection.updateOne({ guild_id }, { $set: old  }, { upsert: true });
        if (res.modifiedCount === 1) return true;
        return null;
    }


    async init (): Promise<void> {
        try {
            const all = await this._settings.fetchAll();
            for (const item of all) {
                this.cache.set(item.guildID, item.security);
            }
            this._settings.db.logger.log(`${EMOTES.DEFAULT.success} successfully initialized the ${this.constructor.name} subfunction.`, this.constructor.name);
        } catch (error) {
            this._settings.db.logger.error(error, this.constructor.name);
        }
    }
    
}
