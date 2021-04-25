import { Message, Structures } from 'discord.js';
import { AitherBot } from '../core/src/client/Client';
import { AitherGuild } from './Guild';
import { AitherUser } from './User';


export class AitherMessage extends Message {
    guild!: AitherGuild | null;
    client!: AitherBot;
    author!: AitherUser;
}

export default (): typeof AitherMessage => Structures.extend('Message', () => AitherMessage);
