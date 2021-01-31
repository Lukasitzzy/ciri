import { Channel } from 'discord.js';
import { Base, Guild, GuildMember } from 'discord.js';
import { DiscordBotClient } from '../../client/Client';
import { IWsResponse } from './types';
import * as InteractionConstants from './InteractionConstants';

export class Interaction extends Base {
    client!: DiscordBotClient;
    private readonly $channel?: Channel;
    private readonly $type: string;
    private readonly $id: string;
    private readonly $guild?: Guild;
    private readonly $token: string;
    private readonly $member?: GuildMember;
    /**
     *
     */
    constructor(client: DiscordBotClient, data: IWsResponse) {
        super(client);


        this.$id = data.id;
        this.$type = InteractionConstants.invertedInteractionType[data.type as 1];

        this.$token = data.token;


        this.$channel = client.channels.cache.get(data.channel_id) || undefined;

        this.$guild = client.guilds.cache.get(data.guild_id ?? '') || undefined;

        this.$member = this.$guild?.members.add(data.member, false) ?? undefined;

    }
    get token(): string {
        return this.$token;
    }

    get type(): string {
        return this.$type;
    }

    get channel(): Channel | undefined {
        return this.$channel;
    }

    get guild(): Guild | undefined {
        return this.$guild;
    }

    get member(): GuildMember | undefined {
        return this.$member;
    }
    get id(): string {
        return this.$id;
    }
}