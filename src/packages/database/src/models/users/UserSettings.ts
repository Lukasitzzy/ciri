import { Collection, CollStats } from 'mongodb';
import { Database } from '../../Database';
import { UserSettingsDbData } from '../../../../util/typings/settings';

export class UserSettings {

    public db: Database;
    public collection: Collection<UserSettingsDbData>

    constructor (
        db: Database,
        collection: Collection<UserSettingsDbData>
    ) {

        this.db = db;
        this.collection = collection;
    }


    async init (): Promise<void> {
        this.db.client.logger.log('successfully inited the user settings');
    }

}
