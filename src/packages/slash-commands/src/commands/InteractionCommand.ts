import {
    Collection, Role, NewsChannel,
    Util, GuildMember, User,
    WebhookMessageOptions, GuildChannel, TextChannel
} from 'discord.js';
import { CustomPermissions } from '../util/Permissions';
import { DiscordBot } from '../../../core/src/client/Client';
import { EMOTES } from '../../../util/Constants';
import { getApi } from '../../../util/Functions';
import { InteractionBase } from '../util/Interaction';
import { InteractionResponseType, PermissionStrings } from '../util/Constants';
import { IWSResponse, iWsResponseData } from '../types/InteractionTypes';


export class InterActionCommand extends InteractionBase {

    private _member?: GuildMember;
    private _user?: User;
    private readonly _commandid: string;
    private readonly _data: IWSResponse;
    private readonly _handle: Record<string, (options: { hideSource: boolean; }) => void>;
    private readonly _name: string;
    private readonly _options: iWsResponseData['options'];
    private readonly _resolved: {
        users?: Collection<string, User>;
        members?: Collection<string, GuildMember>;
        channels?: Collection<string, GuildChannel>;
        roles?: Collection<string, Role>;
    };
    public constructor(client: DiscordBot, data: IWSResponse, syncHandle: Record<string, (options: { hideSource: boolean; }) => void>) {
        super(client, data);

        this._handle = syncHandle;
        this._commandid = data.data.id;
        this._name = data.data.name;
        this._options = data.data.options || [];
        this._data = data;
        this._resolved = {};
    }

    public _parse(
        data: iWsResponseData,
        member?: string,
        user?: string,
    ): this {
        if (member) {
            this._member = this.guild?.members.cache.get(member ?? '');
            this._user = this.client.users.cache.get(member);
        }
        if (user) {
            this._user = this.client.users.cache.get(user);
        }
        if (this.data?.data.resolved) {
            const {
                channels,
                members,
                roles,
                users
            } = this.data.data.resolved;

            if (channels) {
                this._parseChannels(channels);
            }
            if (users) {
                this._parseUsers(users);
            }
            if (members) {
                this._parseMembers(members);
            }
            if (roles) {
                this._parseRoles(roles);
            }
        }

        return this;
    }

    public ack(hideSource: boolean): void {
        this._handle.ack({ hideSource });
    }


    public async reply({
        content,
        options,
        type,
        ephemeral
    }: {
        content: string;
        options?: WebhookMessageOptions;
        type?: number;
        ephemeral?: boolean;
    }): Promise<void> {
        return this._reply({
            content,
            options: {
                ephemeral: ephemeral || false,
                options,
            },
            type: type || InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE
        });
    }


    async panik({
        error,
    }: {
        error: Error;
    }): Promise<void> {
        const content = 
        `${this.emote('error')} failed to run the command\n\`\`\`js\n${error.name}: ${error.message}\`\`\``;
        return this.reply({
            content,
            ephemeral: true
        });
    }

    async fail({
        content,
        ephemeral,
        options
    }: {
        content: string,
        ephemeral: boolean,
        options?: WebhookMessageOptions;
    }): Promise<void> {
        const emote = this.emote('error');
        content = `${emote} failed to run the command \`${this.name}\` reason:\n${content}`;
        return this._reply({
            content,
            options: {
                ephemeral,
                options
            },
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE
        });
    }

    async success({
        content,
        ephemeral,
        options
    }: {
        content: string,
        ephemeral: boolean,
        options?: WebhookMessageOptions;
    }): Promise<void> {

        const emote = this.emote('success');
        content = `${emote} ${content}`;
        return this._reply({
            content,
            options: {
                ephemeral,
                options
            },
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE
        });
    }

    public emote(emote: keyof typeof EMOTES.CUSTOM): string {
        if (this.channel instanceof TextChannel || this.channel instanceof NewsChannel) {
            const hasPermission = this.channel.permissionsFor(this.guild?.roles.everyone.id || '')?.has('USE_EXTERNAL_EMOJIS');
            if (!hasPermission) {
                return EMOTES.DEFAULT[emote];
            }
            else {
                return EMOTES.CUSTOM[emote];
            }
        }
        return EMOTES.DEFAULT[emote];
    }

    public get member(): GuildMember | undefined {
        return this._member;
    }

    public get name(): string {
        return this._name;
    }

    public get commandID(): string {
        return this._commandid;
    }

    public get command(): iWsResponseData {
        return this._data.data;
    }

    public get user(): User | undefined {
        return this._user;
    }
    get options(): iWsResponseData['options'] {
        return this._options;
    }

    public get data(): IWSResponse | null {
        if (this._data) {
            const copy = Util.cloneObject(this._data) as IWSResponse;
            return copy;
        }
        return null;

    }

    public get permissions(): CustomPermissions {
        if (!this.member) return new CustomPermissions(0n);
        return new CustomPermissions(
            CustomPermissions.resolve(BigInt(this.data?.member?.permissions || PermissionStrings.USE_APPLICATION_COMMANDS))
        );

    }
    public get resolved(): InterActionCommand['_resolved'] {
        return this._resolved;
    }


    private async _reply({
        content,
        options,
        type
    }: {
        content: string;
        type: number,
        options?: {
            ephemeral: boolean;
            options?: WebhookMessageOptions;
        };
    }): Promise<any> {

        const api = getApi(this.client);
        if (!this.client.user?.id) throw new Error('client not ready');
        if (options?.ephemeral) {
            const data = {
                type: type || 2,
                data: {
                    type: 2,
                    content: content,
                    flags: 0
                }
            };
            data.data.flags = 64;
            data.type = 3;
            data.data.type = 3;
            try {
                await api.interactions(this.id, this.token).callback.post({ data });
            } catch (error) {
                this.client.logger.error(error, 'interaction.reply');
            }
            return;
        } else {
            const data = {
                type: type || 2,
                data: {
                    type: 2,
                    content: content,
                    options: {
                        allowed_mentions: {
                            parse: []
                        }


                    },
                    flags: 0
                }
            };
            if (options?.options) {
                data.data.options = {
                    ...options.options,
                    allowed_mentions: {
                        parse: []
                    }
                };
            }
            try {
                await api.webhooks(this.id, this.token).post(data);
            } catch (error) {
                this.client.logger.error(error, 'interaction.reply.webhook');
            }
        }
    }

    private _parseChannels(channels: Record<string, any>) {
        const channelIDs = Object.keys(channels);
        this._resolved.channels = new Collection();
        for (const channelID of channelIDs) {
            const RawChannel = channels[channelID];
            if (RawChannel) {
                const channel = this.guild?.channels.cache.get(channelID) || this.guild?.channels.add(
                    RawChannel,
                    false,
                    {
                        id: channelID,
                        extras: []
                    }
                );
                if (channel) {
                    this._resolved.channels?.set(channelID, channel);
                }
            }
            continue;
        }
    }

    private _parseMembers(members: Record<string, any>) {
        const memberIDs = Object.keys(members);
        this._resolved.members = new Collection();
        for (const memberID of memberIDs) {
            const RawMember = members[memberID];
            if (RawMember) {
                const member = this.guild?.members.cache.get(memberID) || this.guild?.members.add(RawMember, false);
                if (member) {
                    this._resolved.members?.set(memberID, member);
                }
            }
            continue;
        }
    }

    private _parseUsers(users: Record<string, any>) {
        const userIDs = Object.keys(users);
        this._resolved.users = new Collection();
        for (const userID of userIDs) {
            const rawUser = users[userID];
            if (rawUser) {
                const user = this.client.users.cache.get(userID) || this.client.users.add(rawUser, false);
                if (user) {
                    this._resolved.users.set(userID, user);
                }
            }
            continue;
        }
    }

    private _parseRoles(roles: Record<string, any>) {
        const roleIDs = Object.keys(roles);
        this._resolved.roles = new Collection();
        for (const roleID of roleIDs) {
            const rawUser = roles[roleID];
            if (rawUser) {
                const role = this.guild?.roles.cache.get(roleID) || this.guild?.roles.add(rawUser, false);
                if (role) {
                    this._resolved.roles.set(roleID, role);
                }
            }
            continue;
        }
    }
}
