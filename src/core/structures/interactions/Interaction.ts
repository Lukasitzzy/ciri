import { Channel } from 'discord.js';
import { Base, Guild, GuildMember } from 'discord.js';
import { DiscordBotClient } from '../../client/Client';
import { IWsResponse } from './types';
import * as InteractionConstants from './InteractionConstants';

export class Interaction extends Base {
    client!: DiscordBotClient;
    private readonly _channel?: Channel;
    private readonly _type: string;
    private readonly _id: string;
    private readonly _guild?: Guild;
    private readonly _token: string;
    private readonly _member?: GuildMember;
    /**
     *
     */
    constructor(client: DiscordBotClient, data: IWsResponse) {
        super(client);


        this._id = data.id;
        this._type = InteractionConstants.invertedInteractionType[data.type as 1];

        this._token = data.token;


        this._channel = client.channels.cache.get(data.channel_id) || undefined;

        this._guild = client.guilds.cache.get(data.guild_id ?? '') || undefined;

        this._member = this._guild?.members.add(data.member, false) ?? undefined;

    }
    get token(): string {
        return this._token;
    }

    get type(): string {
        return this._type;
    }

    get channel(): Channel | undefined {
        return this._channel;
    }

    get guild(): Guild | undefined {
        return this._guild;
    }

    get member(): GuildMember | undefined {
        return this._member;
    }
    get id(): string {
        return this._id;
    }
}