import { Db, MongoClient } from 'mongodb';
import { DiscordBot } from '../../core/src/client/Client';
import { AllowedCollectionNames } from '../../util/Constants';
import { enumerable } from '../../util/decorators';
import { GuildSettings } from './models/Guilds/GuildSettings';


export class Database {
    
    @enumerable
    public client: DiscordBot;

    @enumerable
    public settings!: GuildSettings;

    @enumerable
    protected allowedDatabases  = [...Object.values(AllowedCollectionNames)];

    @enumerable
    protected db!: Db;

    @enumerable
    public economy: any;
    /**
     *
     */
    constructor(client: DiscordBot, options: any) {
        
        this.client = client;

    }

    async init (): Promise<void> {
        if (process.env.DISABLE_DB=== 'true') return;
	const URI  = this._buildUri();
        const client = await new MongoClient(`mongodb://${URI}`, {
            useNewUrlParser: true,
            auth: process.env.DATABASE_AUTH ? (() => {
                const [user, pass] = process.env.DATABASE_AUTH.split('ßßßß');
                return {
                    user: user,
                    password: pass
                };
            })() : undefined,
            useUnifiedTopology: true
        }).connect();

        const db = this.db = client.db(process.env.DATBASE_NAME || 'discord_bot');

        const collections = await db.collections();        

        for (const collection of collections) {
            
            switch (collection.collectionName) {
                case AllowedCollectionNames.GuildSettings:
                    console.log('true');
                    
                    this.settings = new GuildSettings(this, collection);
                    await this.settings.init();
                    break;
                default:
                    break;
            }
        }

    }


    async dropCollection(collection: string): Promise<boolean> {
        return this.db.dropCollection(collection);
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

