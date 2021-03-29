import { Database } from '../../Database';
import { IGuildSettings } from '../../util/typings';
import * as mongo from 'mongodb';
import { EMOTES } from '../../../../util/Constants';
import { BaseModel } from '../../base/BaseModel';
export class GuildSettingsModel extends BaseModel<IGuildSettings> {
    constructor (db: Database, collection: mongo.Collection<IGuildSettings>) {
        super(db, 'guild_id',collection);
    }    

    async init (): Promise<void> {
        const all = await this.fetchAll();
        for (const data of all) {
            this.cache.set(data.guild_id, data);
        }
        this.db.logger.log(`${EMOTES.DEFAULT.success} successfully inited all guild settings.`, `${this.name}`);
        
    }

    async fetchAll(): Promise<IGuildSettings[]> {
        return this.query.find().toArray();
    }


}
