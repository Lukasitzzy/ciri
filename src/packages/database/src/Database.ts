/* eslint-disable no-case-declarations */
import * as mongo from 'mongodb';
import { Logger } from '../../core/src/logger/Logger';
import {
    DefaultDatabaseConfig,
    AllowedCollectionNames,
    EMOTES
} from '../../util/Constants';
import { GuildSettings } from './models/guilds/GuildSettings';
export class Database {

    private _db!: mongo.Db;
    public readonly logger: Logger;
    private readonly _collections: mongo.Collection<Record<string, unknown>>[];
    private _settings!: GuildSettings;


    private readonly _options: {
        appname: string;
        dbname: string;
        host: string,
        port: number;
        auth?: {
            user: string;
            password: string;
        };
    };
    /**
     *
     */
    constructor(options?: {
        appname: string;
        shards: number[];
        auth?: { user: string; password: string; };
        dbname: string;
        host: string;
        port: number;
    }) {
        this._options = options ? {
            appname: options.appname,
            auth: options.auth,
            dbname: options.dbname,
            host: options.host,
            port: options.port
        } : DefaultDatabaseConfig;

        this.logger = new Logger(options?.shards);
        this._collections = [];

    }

    async connect(): Promise<void> {
        if (process.env.DISABLE_DB === 'true') return;
        const client = await mongo.connect(
            `mongodb://${this._options.host}:${this._options.port}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,

                appname: this._options.appname,
                auth: this._options.auth ? this._options.auth : undefined
            }
        );
        this._db = client.db(this._options.dbname);


        const collections = await this._db.collections();
        const allowedNames = Object.values(AllowedCollectionNames);
        for (const coll of collections) {
            if (!allowedNames.includes(coll.collectionName as 'global.blacklist')) {
                this.logger.debug(`found unknown collecion ${coll.collectionName}`);
                continue;
            }
            switch (coll.collectionName) {
            case AllowedCollectionNames.GuildSettings:
                this._settings = new GuildSettings(this, coll);
                await this._settings.init();
                break;
            default:
                break;
            }
            this._collections.push(coll);
        }
        this.logger.log(`${EMOTES.DEFAULT.success} successfully connected to the ${this._options.dbname} database.`, this.constructor.name);
    }



    private _checkReady() {
        if (!this._db) throw new Error('not ready');
    }
    get name (): string {
        return this.constructor.name;
    }

}
