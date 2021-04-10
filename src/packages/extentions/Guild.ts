import { Guild, Structures } from 'discord.js';
import { DiscordBot } from '../core/src/client/Client';

export class ChristinaGuild extends Guild {

    client!: DiscordBot;

    async blacklist(reason: string): Promise<void> {
        console.log(reason);
        return;
    } 
}

export const guildFunction = (): typeof ChristinaGuild => Structures.extend('Guild', () => ChristinaGuild);
