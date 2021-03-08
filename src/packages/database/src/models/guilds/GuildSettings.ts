import { Database } from '../../Database';
import { IGuildSettings } from '../../util/typings';
import { Collection } from 'discord.js';
import * as mongo from 'mongodb';
import { EMOTES } from '../../../../util/Constants';
export class GuildSettings {
    // @enumerable(false)
    private readonly _db: Database;
    readonly cache: Collection<string, IGuildSettings>;
    private readonly _query: mongo.Collection<IGuildSettings>;
    constructor (db: Database, collection: mongo.Collection<IGuildSettings>) {
        this.cache = new Collection<string, IGuildSettings>();
        this._db = db;
        this._query = collection;
    }    

    async init (): Promise<void> {
        const all = await this.fetchAll();
        for (const data of all) {
            this.cache.set(data.guild_id, data);
        }
        this._db.logger.log(`${EMOTES.DEFAULT.success} successfully inited all guild settings.`, `${this.name}`);
        
    }

    async fetchAll(): Promise<IGuildSettings[]> {
        return this._query.find().toArray();
    }

    get name (): string {
        return `${this._db.name}:${this.constructor.name}`;
    }

    toString(): string {
        return `${this.name}(size=${this.cache.size})`;
    }
    get db (): Database {
        return this._db;
    }
}
