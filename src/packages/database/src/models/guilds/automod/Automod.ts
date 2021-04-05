import { Cache } from '../../../../../util/Cache';
import { EMOTES } from '../../../../../util/Constants';
import { IGuildSettingsAutomod } from '../../../util/settings';
import { GuildSettingsModel } from '../GuildSettings';

export class GuildSettingsAutomodModel {

    public readonly cache: Cache<string, IGuildSettingsAutomod>;

    private readonly _settings: GuildSettingsModel 
    /**
     *
     */
    constructor(settings: GuildSettingsModel) {
        this._settings = settings;

        this.cache = new Cache();
        
    }

    async fetchAll(): Promise<IGuildSettingsAutomod[]> {
        return this._settings.fetchAll().then(data => data.map(settings => settings.automod));
    }

    async fetch(guild_id: string): Promise<IGuildSettingsAutomod | undefined | null> {
        return this._settings.fetch(guild_id).then(settings => settings?.automod);
    }

    get(guild_id: string): IGuildSettingsAutomod | undefined {
        return this.cache.get(guild_id);
    }

    async enable(guild_id: string): Promise<boolean| null> {
        const old = this._settings.get(guild_id) || await this._settings.fetch(guild_id);
        if (!old) return null;
        if (old.automod.enabled) return true;
        old.automod.enabled = true;
        const res = await this._settings.collection.updateOne({ guild_id }, { $set: old  }, { upsert: true });
        if (res.modifiedCount === 1) return true;
        return null;
    }


    async init (): Promise<void> {
        try {
            const all = await this._settings.fetchAll();
            for (const item of all) {
                this.cache.set(item.guild_id, item.automod);
            }
            this._settings.db.logger.log(`${EMOTES.DEFAULT.success} successfully initialized the ${this.constructor.name} subfunction.`, this.constructor.name);
        } catch (error) {
            this._settings.db.logger.error(error, this.constructor.name);
        }
    }
    
}
