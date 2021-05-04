import { AitherBot } from '../../core/src/client/Client';
import { Database } from '../../database/Database';
import { ProfileManager } from './users/ProfileManager';

export class EconomyManager {
    private readonly _client: AitherBot;
    private readonly _db: Database['economy'];
    private readonly _profiles: ProfileManager;
    constructor(client: AitherBot, db: Database['economy']) {
        this._client = client;
        this._db = db;
        this._profiles = new ProfileManager(this);
    }

    get db(): Database['users'] {
        return this._db;
    }

    get profiles(): ProfileManager {
        return this._profiles;
    }

    get client(): AitherBot {
        return this._client;
    }
}
