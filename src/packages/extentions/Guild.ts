import { Guild, Structures } from 'discord.js';
import { AitherBot } from '../core/src/client/Client';
import { enumerable } from '../util/decorators';
import { GuildSettingsHelper } from './helpers/GuildSettingsHelper';

export class AitherGuild extends Guild {

    client!: AitherBot;

    @enumerable
    public settings: GuildSettingsHelper;

    /**
     *
     */
    constructor(client: AitherBot, data: Record<string, unknown>) {
        super(client, data);
        this.settings = new GuildSettingsHelper(this);
    }

    async fetch(): Promise<this> {
        return super.fetch() as Promise<this>;
    }
    async isYeeted(): Promise<boolean> {

	return false;
   }
    async yeet(): Promise<void> {

        return;
    } 
}

export const guildFunction = (): typeof AitherGuild => Structures.extend('Guild', () => AitherGuild);
