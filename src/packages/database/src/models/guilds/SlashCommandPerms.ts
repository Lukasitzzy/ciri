import { Database } from '../../Database';
import { ISlashCommandGuildPermissions } from '../../util/typings';
import * as mongo from 'mongodb';
import { BaseModel } from '../../base/BaseModel';
import * as Discord from 'discord.js';
export class SlashCommandPermissionGuildModel extends BaseModel<ISlashCommandGuildPermissions> {

    constructor(db: Database, collection: mongo.Collection<ISlashCommandGuildPermissions>) {
        super(db, 'guild_id', collection);
    }

    async init(): Promise<void> {

        const kesy = this.key;

        const entries = await this.query.find().toArray();
        for (const entry of entries) {
            const ID = entry[kesy];
            if (typeof ID !== 'string') {
                this.db.logger.debug(`Collection ${this.query.collectionName} does not have a valid "entry id" ${kesy} `, this.name);
                continue;
            }
            this.cache.set(`${ID}:${entry.slash_command}`, entry);
        }

        this.db.logger.log(`✔ sucessfully booted up the Model ${this.name} (entries: ${this.cache.size}/${entries.length}) `);


    }

    async setPermissionsByRole(role: Discord.Role): Promise<void> {

        //
    }

    async setPermissionyByUser(user: Discord.User): Promise<void> {
        //
    }

    async setPermissionByChannel(user: Discord.TextChannel): Promise<void> {
        //
    }

    async setPermissionByCategory(user: Discord.CategoryChannel): Promise<void> {
        //
    }

    async updateOne({
        guild_id,
        slashCommand,
        key,
        data,
        method
    }: {
        guild_id: string,
        slashCommand: string,
        key: keyof ISlashCommandGuildPermissions,
        data: ISlashCommandGuildPermissions[typeof key];
        method: 'UPDATE' | 'REPLACE'
    }): Promise<ISlashCommandGuildPermissions | null> {
        const old = this.cache.get(`${guild_id}:${slashCommand}`) || await this.query.findOne({ 
            guild_id, slash_command: slashCommand
        });

        if (!old) {
            return null;
        }
        //eslint-disable-next-line
        //@ts-ignore
        const existing: IslashCOmmandGuildPermissions = this._updateProp(existing, key, data);
        this.cache.set(`${guild_id}:${slashCommand}`, existing);
        const res = await this.query.updateOne({ guild_id, slash_command: slashCommand }, { $set: existing });
        if (res.modifiedCount === 1) {
            return existing;
        } else {
            throw new Error('weird error accured pls fix');
        }
    }

    private _updateProp(existing: any, key: any, data: any) {
        existing[key] = data;
        return existing;
    }
}
