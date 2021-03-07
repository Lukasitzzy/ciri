import * as mongo from 'mongodb';

export class DatabaseClient {

    private _db!: mongo.Db;
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
    constructor(options: {
        appname: string;
        dbname: string;
        host: string;
        port: number;
        auth?: {
            user: string;
            password: string;
        };
    }) {
        this._options = {
            appname: options.appname,
            dbname: options.dbname,
            host: options.host,
            port: options.port,
            auth: options.auth
        };


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
    }



    private _checkReady() {
        if (!this._db) throw new Error('not ready');
    }

}
