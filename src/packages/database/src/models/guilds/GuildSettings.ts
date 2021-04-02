import { Database } from '../../Database';
import { IGuildSettings, IGuildSettingsAutomod } from '../../util/typings';
import * as mongo from 'mongodb';
import { EMOTES } from '../../../../util/Constants';
import { BaseModel } from '../../base/BaseModel';
export class GuildSettingsModel extends BaseModel<IGuildSettings> {
    constructor(db: Database, collection: mongo.Collection<IGuildSettings>) {
        super(db, 'guild_id', collection);
    }

    async init(): Promise<void> {
        const all = await this.fetchAll();
        for (const data of all) {
            this.cache.set(data.guild_id, data);
        }
        this.db.logger.log(`${EMOTES.DEFAULT.success} successfully inited all guild settings.`, `${this.name}`);

    }

    async fetchAll(): Promise<IGuildSettings[]> {
        return this.collection.find().toArray();
    }

    async updateAutomod(
        guild: string,
        automodsettings: keyof IGuildSettingsAutomod, 
        data: IGuildSettingsAutomod[typeof automodsettings]
        ): Promise<IGuildSettingsAutomod | undefined> {
            const allAutomod = (await this.collection.findOne({ guild_id: guild }).then(settings => settings?.automod)) ||({
                enabled: false,
                filters: {
                    messages: {
                        regexps: [],
                        enabled: false,
                        invites: {
                            allowed_invites: [],
                            enabled: false,
                            messages: [],
                        },
                        links: {
                            allowed_domains: [],
                            enabled: false,
                            messages: []
                        },
                        messages: {
                            enabled: false,
                            messages: [],
                            regexps:  []
                        }
                    },
                    names: {
                        enabled: false,
                        filters: [],
                        action: 'KICK',
                        regexps: []
                    }
                }
            }) as  IGuildSettingsAutomod;
            if (allAutomod[automodsettings]) {
                if (typeof allAutomod[automodsettings] === typeof data) {
                allAutomod[automodsettings] = data as any;
                }
            }
            allAutomod[automodsettings];
            return this.collection.findOneAndUpdate({ 
                guild_id: guild
            }, { $set: {
                automod: allAutomod
            } }).then(res => res.value?.automod);
        }


    async updatePrefix(guildID: string, prefix: string): Promise<IGuildSettings| undefined> {
        return this.collection.findOneAndUpdate({
            guild_id: guildID
        }, {
            $set: {
                prefix: prefix
            }
        }, { upsert: true }).then(res => {
            return res.value;
        });
    }
}
