import { GuildMember, User, WebhookMessageOptions } from 'discord.js';
import { DiscordBot } from '../../../core/src/client/Client';
import { getApi } from '../Client/Client';
import { InteractionBase } from '../util/Interaction';
import { IWSResponse, iWsResponseData } from '../types/InteractionTypes';
import { InteractionResponseType } from '../util/Constants';
import { Util } from 'discord.js';
export class InterActionCommand extends InteractionBase {

    private _member?: GuildMember;
    private _user?: User;
    private readonly _commandid: string;
    private readonly _data: IWSResponse;
    private readonly _handle: Record<string, (options: { hideSource: boolean; }) => void>;
    private readonly _name: string;
    private readonly _options: iWsResponseData['options'];

    constructor(client: DiscordBot, data: IWSResponse, syncHandle: Record<string, (options: { hideSource: boolean; }) => void>) {
        super(client, data);

        this._handle = syncHandle;
        this._commandid = data.data.id;
        this._name = data.data.name;
        this._options = data.data.options || [];
        this._data = data;
    }

    _parse(
        data: iWsResponseData,
        member?: string,
        user?: string,
    ): this {
        if (member) {
            this._member = this.guild?.members.cache.get(member ?? '');
        }
        if (user) {
            this._user = this.client.users.cache.get(user);
        }
        return this;
    }

    ack(hideSource: boolean): void {
        this._handle.ack({ hideSource });
    }


    async reply({
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



    private async _reply({ content, options, type }: { content: string; type: number, options?: { ephemeral: boolean; options?: WebhookMessageOptions; }; }): Promise<any> {
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
                    flags: 0
                }
            };
            try {
                await api.interactions(this.id, this.token).callback.post({
                    data
                });
            } catch (error) {
                this.client.logger.error(error, 'interaction.reply.webhook');
            }
        }
    }


    get member(): GuildMember | undefined {
        return this._member;
    }

    get name(): string {
        return this._name;
    }

    get commandID(): string {
        return this._commandid;
    }

    get command(): iWsResponseData {
        return this._data.data;
    }

    get user(): User | undefined {
        return this._user;
    }

    get data(): IWSResponse {
        const copy = Util.cloneObject(this._data) as IWSResponse;
        return copy;

    }


}
