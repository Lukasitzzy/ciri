import { GuildMember } from 'discord.js';
import { Collection, ObjectId } from 'mongodb';
import { AitherBot } from '../../../../../core/src/client/Client';
import { AitherGuild } from '../../../../../extentions/Guild';
import { AitherUser } from '../../../../../extentions/User';
import { Cache } from '../../../../../util/Cache';
import { EMOTES } from '../../../../../util/Constants';
import { enumerable } from '../../../../../util/decorators';
import { GuildCasesDbData } from '../../../../../util/typings/ModerationSettings';
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

    setModerator(moderator: GuildMember): this {
        this.moderatorID = moderator.id;
        return this;
    }

    setReason(reason: string): this {
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

    @enumerable
    public readonly client: AitherBot;

    public readonly db: Database;
    public readonly cache: Cache<string, GuildCasesDbData>;
    private readonly collection: Collection<GuildCasesDbData>;

    constructor(client: GuildSettings, collection: Collection<GuildCasesDbData>) {

        this.client = client.db.client;
        this.db = client.db;

        this.collection = collection;
        this.cache = new Cache();

    }

    async init(): Promise<void> {

        const entries = await this.collection.find().toArray();


        for (const entry of entries) {
            this.cache.set(entry.caseID, entry);

        }

        this.client.logger.log(`${EMOTES.DEFAULT.success} successfully cached ${this.cache.size} entries.`, this.constructor.name);

    }

    create({
        moderator,
        user,
        action,
        guild,

    }: {
        moderator: GuildMember,
        user: AitherUser;
        guild: AitherGuild;
        action: 'BAN' | 'KICK' | 'MUTE';
    }): GuildCase {

        const newCase = new GuildCase(
            this.collection,
            {
                moderatorID: moderator.id === this.client.user?.id ? 'SELF_MOD' : moderator.id,
                userID: user.id,
                action: action,
                guildID: guild.id,
                caseID: new ObjectId().toHexString(),
                num: this.cache.filter(entry => entry.guildID === guild.id).size || 1
            }
        );
        return newCase;



    }


}
