import { GuildMember } from 'discord.js';
import { Collection, ObjectId } from 'mongodb';
import { AitherBot } from '../../../../core/src/client/Client';
import { AitherGuild } from '../../../../extension/Guild';
import { AitherUser } from '../../../../extension/User';
import { Cache } from '../../../../util/Cache';
import { EMOTES } from '../../../../util/Constants';
import { enumerable } from '../../../../util/decorators';
import { GuildCasesDbData } from '../../../../util/typings/ModerationSettings';
import { Database } from '../../../Database';
import { GuildSettings } from '../GuildSettings';

class GuildCase implements GuildCasesDbData {
    action: 'BAN' | 'KICK' | 'MUTE';
    guildID: string;
    moderatorID: string;
    num: number;
    userID: string;
    caseID: string;
    reason?: string;
    referenceCase?: string;
    @enumerable
    private readonly _collection: Collection<GuildCasesDbData>;
    constructor(collection: Collection<GuildCasesDbData>, data: GuildCasesDbData) {

        this._collection = collection;

        this.caseID = data.caseID || new ObjectId().toHexString();
        this.action = data.action;
        this.moderatorID = data.moderatorID;
        this.num = data.num;
        this.userID = data.userID;
        this.reason = data.reason;
        this.guildID = data.guildID;
        this.referenceCase = data.referenceCase;

    }

    setAction(action: 'BAN' | 'KICK' | 'MUTE'): this {
        this.action = action;
        return this;
    }

    setGuild(guild: AitherGuild): this {
        this.guildID = guild.id;
        return this;
    }

    setModerator(moderator: GuildMember): this {
        this.moderatorID = moderator.id;
        return this;
    }

    setUser(user: AitherUser): this {
        this.userID = user.id;
        return this;
    }


    setReferenceCase(caseNum: string): this {
        this.referenceCase = caseNum;
        return this;
    }
    

    setReason(reason = ''): this {
        this.reason = reason;
        return this;
    }


    toJSON(): GuildCasesDbData {
        return {
            action: this.action,
            guildID: this.guildID,
            caseID: this.caseID,
            moderatorID: this.moderatorID,
            num: this.num,
            userID: this.userID,
            reason: this.reason,
            referenceCase: this.referenceCase
        };
    }

    async save() {
        await this._collection.insertOne(this.toJSON());
    }
}

export class GuildCases {

    private readonly _settings: GuildSettings;
    public readonly cache: Cache<string, GuildCasesDbData>;
    private readonly collection: Collection<GuildCasesDbData>;

    constructor(settings: GuildSettings, collection: Collection<GuildCasesDbData>) {

        this._settings = settings;

        this.collection = collection;
        this.cache = new Cache();

    }

    async init(): Promise<void> {

        const entries = await this.collection.find().toArray();


        for (const entry of entries) {
            this.cache.set(entry.caseID, entry);

        }
        if (this.cache.size) {
            this.discordClient.logger.log(`${EMOTES.DEFAULT.success} successfully cached ${this.cache.size} entries.`, this.constructor.name);
        } else {
            this.discordClient.logger.log(`${EMOTES.DEFAULT.success} successfully initialized the Guild case plugin.`, this.constructor.name);
        }
    }

    createEmpty(caseNum?: number): GuildCase {

        if (!caseNum) caseNum = 1;
        else caseNum = caseNum +1;
        return new GuildCase(
            this.collection,
            {
                moderatorID: '',
                action: 'BAN',
                caseID: '',
                guildID: '',
                num: caseNum || 0,
                userID: '',
                reason: '',
                referenceCase: ''
            }
        );
    }

    async create({
        moderator,
        user,
        reason,
        action,
        guild,

    }: {
        moderator: GuildMember,
        user: AitherUser;
        guild: AitherGuild;
        reason?: string;
        action: 'BAN' | 'KICK' | 'MUTE';
    }): Promise<GuildCase> {
        const Case = this.createEmpty(await this.collection.count({ guildID: guild.id }));
        Case
        .setAction(action)
        .setModerator(moderator)
        .setUser(user)
        .setGuild(guild)
        .setReason(reason);
        return Case;
    }


    get discordClient(): AitherBot {
        return this._settings.db.client;
    }


    get settings(): GuildSettings {
        return this._settings;
    }

    get db(): Database {
        return this._settings.db;
    }

}
