import { Structures, User} from 'discord.js';
import { DiscordBot } from '../core/src/client/Client';

export class AitherUser extends User {
    client!: DiscordBot;
    async blacklist(reason: string): Promise<void> {
        console.log(reason);
        return;
    } 
}

export const userFunction = (): typeof AitherUser => Structures.extend('User', () => AitherUser);
