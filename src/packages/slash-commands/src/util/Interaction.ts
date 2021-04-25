import { Base, Guild } from 'discord.js';
import { AitherBot } from '../../../core/src/client/Client';
import { TextbasedChannel } from '../../../core/src/commands/CommandContext';
import { IWSResponse } from '../../../util/typings/InteractionTypes';
import { invertedInteractionType } from './Constants';

export abstract class InteractionBase extends Base {
    public client!: AitherBot;

    private readonly _channel?: TextbasedChannel;
    private readonly _typestr: string;
    private readonly _typeint: number;
    private readonly _id: string;
    private readonly _token: string;
    private readonly _guild?: Guild;
    public constructor(client: AitherBot, data: IWSResponse) {
        super(client);
        this._id = data.id;
        this._typestr = invertedInteractionType[data.type as 1];
        this._typeint = data.type;

        this._token = data.token;
        this._channel = this.client.channels.cache.get(data.channel_id) as TextbasedChannel;
        this._guild = this.client.guilds.cache.get(data.guild_id ?? '') || undefined;

        this._parse?.(data.data,
            data.member?.user.id,
            data.user?.id || data.member?.user.id,
            data.guild_id,
            data.channel_id
        );
    }

    abstract _parse(
        data: IWSResponse['data'],
        member?: string,
        user?: string,
        guild?: string,
        channel?: string,
    ): this;


    get channel(): InteractionBase['_channel'] {
        return this._channel;
    }

    get type(): InteractionBase['_typestr'] {
        return this._typestr;
    }

    get id(): InteractionBase['_id'] {
        return this._id;
    }
    get token(): string {
        return this._token;

    }

    get guild(): InteractionBase['_guild'] {
        return this._guild;
    }

    get typeint(): InteractionBase['_typeint'] {
        return this._typeint;
    }


}
