import { enumerable } from '../../util/decorators';
import { GuildSettingsDocument } from '../../util/typings/settings';
import { AitherGuild } from '../Guild';


export class GuildSettingsHelper {
    
    @enumerable
    private readonly _guild: AitherGuild;
    public data?: GuildSettingsDocument

    constructor(guild: AitherGuild) {
        this._guild = guild;
    }

    async sync(): Promise<GuildSettingsDocument> {
        const data = await this._guild.client.db.settings.fetch(this._guild.id);

        if (data) {
            this.data = data;
            return data;
        } else {
            const r = await this._guild.client.db.settings.insert(this._guild.id) || this._guild.client.db.settings['_createDefaultEntry'](this._guild.id);
            this.data = r;
            return r;
        }

    }

    async update<K extends keyof GuildSettingsDocument>({
        key,
        data
    }: {
        key: K;
        data: GuildSettingsDocument[K]
    }): Promise<null | boolean> {
        const existing = this.data || await this._guild.client.db.settings.fetch(this._guild.id);

        if (!existing) {
            return null;
        }

        if (Object.prototype.hasOwnProperty.call(existing, key)) {
            existing[key] = data;
            const res = await this._guild.client.db.settings.update({ 
                data: data,
                key,
                guildID: this._guild.id
             });
             if (res) {
                 return true;
             
             }     else {
                 return false;
             }
        }
        return false;



    }
    get<
    T extends GuildSettingsDocument[keyof GuildSettingsDocument]
    >(key: keyof GuildSettingsDocument): (T | null) {
        if (!this.data) {
            return null;
        } 
        return this.data[key] as T ;
    }

    
}
