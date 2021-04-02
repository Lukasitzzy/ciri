/* eslint-disable no-case-declarations */
import * as mongo from 'mongodb';
import { DiscordBot } from '../../core/src/client/Client';
import { Logger } from '../../core/src/logger/Logger';
import {
    DefaultDatabaseConfig,
    AllowedCollectionNames,
    EMOTES
} from '../../util/Constants';
import { GuildSettingsModel } from './models/guilds/GuildSettings';
export class Database {

    private _db!: mongo.Db;
    public readonly logger: Logger;
    private readonly _collections: mongo.Collection<Record<string, unknown>>[];
    private _settings!: GuildSettingsModel;
    private readonly _shards: number[];

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
        this._shards = options?.shards || [0, 1];

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
        this._checkReady();

        const collections = await this._db.collections();
        const allowedNames = Object.values(AllowedCollectionNames);
        for (const coll of collections) {
            if (!allowedNames.includes(coll.collectionName as 'global.blacklist')) {
                this.logger.debug(`found unknown collecion ${coll.collectionName}`);
                continue;
            }
            switch (coll.collectionName) {
                case AllowedCollectionNames.GuildSettings:
                    this._settings = new GuildSettingsModel(this, coll);
                    // await this._settings.init();
                    break;
                case AllowedCollectionNames.GlobalBlacklist:
                    break;
                default:
                    break;
            }
            this._collections.push(coll);
        }
        this.logger.log(`${EMOTES.DEFAULT.success} successfully connected to the ${this._options.dbname} database.`, this.constructor.name);
    }

    async checkGuilds(client: DiscordBot): Promise<void> {
        try {
            if (client.guilds.cache.size) {
                for (const [guild_id] of client.guilds.cache) {
                    console.log(guild_id);
                    if (this.settings.cache.has(guild_id)) continue;

                    await this.settings.collection.insertOne({
                        _id: new mongo.ObjectID(),
                        allow_slash_commands: true,
                        version: 1,
                        automod: {
                            enabled: false,
                            filters: {
                                messages: {
                                    enabled: false,
                                    invites: {
                                        allowed_invites: [],
                                        enabled: false,
                                        messages: []
                                    },
                                    links: {
                                        allowed_domains: [],
                                        enabled: false,
                                        messages: []
                                    },
                                    messages: {
                                        enabled: false,
                                        messages: [],
                                        regexps: []
                                    }
                                },
                                names: {
                                    action: 'KICK',
                                    enabled: false,
                                    regexps: []
                                }
                            }
                        },
                        guild_id,
                        prefix: '$'
                });
                }
                await this.settings.init();
            } else {
                this.logger.debug(' no channels found yet..', this.constructor.name);
            }
        } catch (error) {
            console.log('erroring adding stuff, ', error);
        }
    }

    private _checkReady() {
        if (!this._db) throw new Error('not ready');
    }
    get name(): string {
        return this.constructor.name;
    }

    get settings(): GuildSettingsModel {
        return this._settings;
    }

}
