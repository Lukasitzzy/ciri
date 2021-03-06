import { Guild } from 'discord.js';
import { Db, MongoClient, Collection } from 'mongodb';
import { AitherBot } from '../core/src/client/Client';
import { AllowedCollectionNames } from '../util/Constants';
import { enumerable } from '../util/decorators';
import { DatabaseOptions } from '../util/typings/util';
import { GuildSettings } from './models/Guilds/GuildSettings';
import { GuildCases } from './models/Guilds/moderation/GuildCases';
import { UserSettings } from './models/users/UserSettings';


export class Database {

    @enumerable
    public client: AitherBot;

    @enumerable
    public settings!: GuildSettings;

    @enumerable
    protected allowedDatabases = [...Object.values(AllowedCollectionNames)];

    @enumerable
    protected db!: Db;

    @enumerable
    public economy: any;

    public options: DatabaseOptions;
    users!: UserSettings;
    /**
     *
     */
    constructor(client: AitherBot, options: DatabaseOptions) {

        this.client = client;

        this.options = options;

    }

    async init(): Promise<void> {
        if (process.env.DISABLE_DB === 'true') return;
        const URI = this._buildUri();
        const client = await new MongoClient(`mongodb://${URI}`, {
            useNewUrlParser: true,
            auth: process.env.DATABASE_PASSWORD && process.env.DATABASE_USER ? (() => {
                return {
                    user: process.env.DATABASE_USER,
                    password: process.env.DATABASE_PASSWORD
                };
            })() : undefined,
            useUnifiedTopology: true
        }).connect();

        const db = this.db = client.db(process.env.DATBASE_NAME || 'discord_bot');

        const collections = await db.collections();

        for (const collection of collections) {

            switch (collection.collectionName) {
                case AllowedCollectionNames.GuildSettings:
                    this.settings = new GuildSettings(this, collection);
                    await this.settings.init();
                    // eslint-disable-next-line no-case-declarations
                    const cases = collections.find(c => c.collectionName === AllowedCollectionNames.ModerationCases);

                    if (cases) {
                        this.settings.cases = new GuildCases(this.settings, cases);
                        await this.settings.cases.init();
                    }
                    break;
                case AllowedCollectionNames.UserSettings:
                    this.users = new UserSettings(this, collection);
                    await this.users.init();
                    break;
                default:
                    break;
            }
        }
        //nice
    }

    async dropCollection(collection: string): Promise<boolean> {
        return this.db.dropCollection(collection);
    }

    async createCollection(collection: string): Promise<Collection<any>> {
        return this.db.createCollection(collection);
    }


    async checkGuilds(): Promise<void> {

        if (this.client.readyTimestamp) {

            for (const [guildID] of this.client.guilds.cache) {
                if (this.settings) {
                    if (this.settings.cache.has(guildID)) continue;
                    this.client.logger.debug(`guild "${guildID}" not in db.. inserting..`, 'datbase.checkGuilds');
                    const res = await this.settings.insert(guildID);
                    if (!res) {
                        this.client.logger.error(new Error(`failed to insert guild "${guildID}" into settings database`), 'database.insert_guild');
                    }
                    continue;
                }

            }
        }


    }

    private _buildUri() {

        return `${process.env.DATABASE_URI || 'localhost'}:${process.env.DATABASE_PORT || 27015}`;
    }
}

