import { DatabaseClient } from '../Client';

export class GuildSettings {
    // @enumerable(false)
    private readonly _db: DatabaseClient;
    private readonly _data: any;

    constructor (db: DatabaseClient, data: any) {
        this._data = data;
        this._db = db;
    }    
}
