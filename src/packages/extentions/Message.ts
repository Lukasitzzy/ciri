import { Message, Structures } from 'discord.js';
import { DiscordBot } from '../core/src/client/Client';
import { AitherGuild } from './Guild';
import { AitherUser } from './User';


export class AitherMessage extends Message {
    guild!: AitherGuild | null;
    client!: DiscordBot;
    author!: AitherUser;
}

export default () => Structures.extend('Message', () => AitherMessage);
