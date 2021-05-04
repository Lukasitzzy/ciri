import { Collection, ObjectID } from 'mongodb';
import { Cache } from '../../../util/Cache';
import { EMOTES } from '../../../util/Constants';
import { enumerable } from '../../../util/decorators';
import { Database } from '../../Database';
import { GuildSettingsDocument } from '../../typings/settings/GuildSettings';
import { GuildCases } from './moderation/GuildCases';



export class GuildSettings {

    @enumerable
    public db: Database;

    @enumerable
    public collection: Collection<GuildSettingsDocument>;

    public cache: Cache<string, GuildSettingsDocument>;

    public cases!: GuildCases;


    constructor(db: Database, collection: Collection<GuildSettingsDocument>) {

        this.db = db;

        this.collection = collection;
        this.cache = new Cache<string, GuildSettingsDocument>();
    }

    async init(): Promise<void> {

        const entries = await this.collection.find().toArray();

        for (const entry of entries) {
            this.cache.set(entry.guildID, entry);
        }

        this.db.client.logger.log(`${EMOTES.DEFAULT.success} successfully started the GuildSettings. (cached ${this.cache.size} entries)`, 'database.init');

    }

    async fetch(guildID: string): Promise<GuildSettingsDocument | null> {
        return this.collection.findOne({ guildID });

    }

    get(guildID: string): GuildSettingsDocument | undefined {
        return this.cache.get(guildID);
    }


    async sync(): Promise<void> {
        this.cache.clear();
        const entries = await this.collection.find().toArray();

        for (const entry of entries) this.cache.set(entry.guildID, entry);
    }

    async update<K extends keyof GuildSettingsDocument>({
        guildID,    
        key,
        data
    }: {
        guildID: string;
        key: K;
        data: GuildSettingsDocument[K]
    }): Promise<any> {
        const existing = this.get(guildID) || await this.fetch(guildID);

        if (!existing) {
            return null;
        }
        if (Object.prototype.hasOwnProperty.call(existing, key)) {
            existing[key] = data;
            const res = await this.collection.updateOne({  guildID, }, {
                $set: existing
            });
            return res.modifiedCount === 1;
        }


    }

    async insert(guildID: string): Promise<GuildSettingsDocument | null> {
        const existing = this.cache.get(guildID) || await this.fetch(guildID);

        if (existing) return existing;

        const data = this._createDefaultEntry(guildID);

        const res = await this.collection.insertOne(data);

        if (res.ops[0]?.guildID === guildID && res.insertedCount === 1) {
            this.cache.set(guildID, data);
            return {...data};
        } else {
            return null;
        }
    }

    async delete(guildID: string): Promise<boolean> {

        const existing = this.cache.get(guildID) || await this.fetch(guildID);

        if (!existing) return true;

        const res = await this.collection.deleteOne({ guildID });

        if (res.deletedCount === 1) {
            return true;
        }   
        if (res.deletedCount === 0) {
            return true;
        }

        return false;
    }

    public _createDefaultEntry(guildID: string): GuildSettingsDocument {
        return {
            allowSlashCommands: true,
            economy: {},
            createAt: Date.now(),
            updatedAt: Date.now(),
            documentID: new ObjectID().toHexString(),
            guildID,
            prefix: '$',
            security: {
                automod: {
                    enabled: false,
                    filters: {
                        enabled: false,
                        messages: {
                            enabled: false,
                            invites: false
                        }
                    }
                },
                enabled: false
            },
            version: 1
        };
    }


}
