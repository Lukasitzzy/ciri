import { Structures, User} from 'discord.js';
import { AitherBot } from '../core/src/client/Client';

export class AitherUser extends User {
    client!: AitherBot;
    async isYeeted(): Promise<boolean> {

	return false;
    }

    async yeet(reason: string): Promise<void> {
        console.log(reason);
        return;
    } 
}

export const userFunction = (): typeof AitherUser => Structures.extend('User', () => AitherUser);
