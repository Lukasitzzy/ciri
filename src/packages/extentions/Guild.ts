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

    async blacklist(): Promise<void> {

        return;
    } 
}

export const guildFunction = (): typeof AitherGuild => Structures.extend('Guild', () => AitherGuild);
