import { Database } from '../Database';
import * as mongo from 'mongodb';
import { IBaseSettings } from '../../../util/typings/settings';
import { Cache } from '../../../util/Cache';
export abstract class BaseModel<T extends IBaseSettings> {

    private readonly _cache: Cache<string, T>;
    private readonly _db: Database;
    private readonly _primaryKey: keyof T;
    private readonly _query: mongo.Collection<T>;
    constructor(
        db: Database,
        primaryKey: keyof T,
        query: mongo.Collection<T>
    ) {
        this._cache = new Cache<string, T>();
        this._db = db;
        this._primaryKey = primaryKey;
        this._query = query;
    }

    abstract init (): Promise<void> 

    public get db (): Database {
        return this._db;
    }

    public get collection(): mongo.Collection<T> {
        return this._query;
    }

    public get cache(): Cache<string, T> {
        return this._cache;
    }
    get name (): string {
        return `${this.db.name}:${this.constructor.name}`;
    }

    get key(): keyof T {
        return this._primaryKey;
    }

    toString(): string {
        return `${this.name}(size=${this.cache.size})`;
    }
}
