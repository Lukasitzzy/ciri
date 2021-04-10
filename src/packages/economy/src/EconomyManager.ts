import { DiscordBot } from '../../core/src/client/Client';
import { Database } from '../../database/src/Database';
import { ProfileManager } from './users/ProfileManager';

export class EconomyManager {
    private readonly _client: DiscordBot;
    private readonly _db: Database['economy'];
    private readonly _profiles: ProfileManager;
    constructor(client: DiscordBot, db: Database['economy']) {
        this._client = client;
        this._db = db;
        this._profiles = new ProfileManager(this);
    }

    get db(): Database['economy'] {
        return this._db;
    }

    get profiles(): ProfileManager {
        return this._profiles;
    }

    get client(): DiscordBot {
        return this._client;
    }
}
