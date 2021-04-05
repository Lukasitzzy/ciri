import { Database } from '../../Database';
import { ISlashCommandGuildPermissions } from '../../util/settings';
import * as mongo from 'mongodb';
import { BaseModel } from '../../base/BaseModel';
export class SlashCommandPermissionGuildModel extends BaseModel<ISlashCommandGuildPermissions> {

    constructor(db: Database, collection: mongo.Collection<ISlashCommandGuildPermissions>) {
        super(db, 'guild_id', collection);
    }

    async init(): Promise<void> {
        const key = this.key;
        const entries = await this.collection.find().toArray();
        for (const entry of entries) {
            const ID = entry[key];
            if (typeof ID !== 'string') {
                this.db.logger.debug(`Collection ${this.collection.collectionName} does not have a valid "entry id" ${key} `, this.name);
                continue;
            }
            this.cache.set(`${ID}:${entry.slash_command}`, entry);
        }
        this.db.logger.log(`✔ sucessfully booted up the Model ${this.name} (entries: ${this.cache.size}/${entries.length}) `);
    }
}
