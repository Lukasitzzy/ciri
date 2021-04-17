/* eslint-disable no-case-declarations */
import * as mongo from 'mongodb';
import { DiscordBot } from '../../core/src/client/Client';
import { Logger } from '../../core/src/logger/Logger';
import {
    DefaultDatabaseConfig,
    AllowedCollectionNames,
    EMOTES
} from '../../util/Constants';
import { GuildEconomyModel } from './models/guilds/economy/GuildEconomy';
import { GuildSettingsModel } from './models/guilds/GuildSettings';
export class Database {

    private _db!: mongo.Db;
    public readonly logger: Logger;
    private readonly _collections: mongo.Collection<Record<string, unknown>>[];
    private _settings!: GuildSettingsModel;
    private _economy!: GuildEconomyModel;
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
                case AllowedCollectionNames.GuildEconomy:
                    this._economy = new GuildEconomyModel(this, coll);
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
            this._checkReady();
            if (client.guilds.cache.size) {
                for (const [guild_id, { ownerID }] of client.guilds.cache) {

                    if (this._settings) {
                        const exists = this.settings.cache.has(guild_id) || await this.settings.collection.findOne({ guild_id }).then(res => !!res);
                        if (!exists) {
                            this.logger.debug(`found guild ${guild_id} not in db`, 'guild.settings');
                            await this.settings.collection.insertOne({
                                documentID: new mongo.ObjectID(),
                                allowSlashCommands: true,
                                guildID: guild_id,
                                prefix: '+',
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
                                version: 1.01,
                            });
                        }
                    }

                    if (this._economy) {
                        if (!(this.economy.cache.has(guild_id) || await this.economy.collection.findOne({ guild_id }))) {
                            this.logger.debug(`found guild ${guild_id} not in db`, 'economy.settings');
                            
                            await this._economy.collection.insertOne({
                                _id: new mongo.ObjectID(),
                                enabled: true,
                                prefix: '$',
                                bank: {
                                    accounts: [],
                                    owner_id: ownerID,
                                    taxes: {
                                        account_holding: 0.1,
                                        receiving: 0.1,
                                        sending: 0.1
                                    },
                                    vault: 150_000
                                },
                                guild_id,
                            });
                        }
                    }
                }
                await this.settings.init();
            } else {
                this.logger.debug(' no channels found yet..', this.constructor.name);
            }
        } catch (error) {
            this.logger.error(error, 'Datbase.checkGuilds');
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
    get economy(): GuildEconomyModel {
        return this._economy;
    }

}
