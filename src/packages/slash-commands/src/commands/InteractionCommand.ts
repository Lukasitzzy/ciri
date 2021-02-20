import { WebhookClient } from 'discord.js';
import { GuildMember } from 'discord.js';
import { WebhookMessageOptions } from 'discord.js';
import { DiscordBot } from '../../../core/src/client/Client';
import { getApi } from '../Client/Client';
import { InteractionBase } from '../Client/Interaction';
import { IWSResponse, iWsResponseData } from '../types/InteractionTypes';

export class InterActionCommand extends InteractionBase {

    private readonly _handle: Record<string, (options: { hideSource: boolean; }) => void>;
    private readonly _commandid: string;
    private readonly _options: iWsResponseData['options'];
    private _member?: GuildMember;
    constructor(client: DiscordBot, data: IWSResponse, syncHandle: Record<string, (options: { hideSource: boolean; }) => void>) {
        super(client, data);

        this._handle = syncHandle;
        this._commandid = data.data.id;
        this._options = data.data.options || [];
    }

    _parse(
        data: iWsResponseData,
        member?: string,
        user?: string,
        guild?: string,
        channel?: string
    ): this {
        console.log(
            !!data,
            !!member,
            !!user,
            !!guild,
            !!channel
        );

        this._member = this.guild?.members.cache.get(member ?? '');
        return this;
    }

    ack(hideSource: boolean): void {
        this._handle.ack({ hideSource });
    }



    async ephemeral(content: string): Promise<any> {
        return this.reply({ content, options: { ephemeral: true } });
    }

    async send({ content, options }: { content: string; options?: WebhookMessageOptions; }): Promise<void> {
        return this.reply({ content, options: { ephemeral: false, options } });
    }



    private async reply({ content, options }: { content: string; options?: { ephemeral: boolean; options?: WebhookMessageOptions; }; }): Promise<any> {

        const api = getApi(this.client);


        if (!this.client.user?.id) throw new Error('client not ready');
        if (options?.ephemeral) {
            const data = {
                type: 2,
                data: {
                    type: 2,
                    content: content,
                    flags: 0
                }
            };
            data.data.flags = 64;
            data.type = 3;
            data.data.type = 3;

            const res = await api.interactions(this.id, this.token).callback.post({ data });
            console.log('ephemeral message return', res);
            return;
        } else {
            const id = this.client.user.id ?? (await this.client.fetchApplication()).id;

            const wh = new WebhookClient(id, this.token);

            const data = {
                content,
                ...options
            };


            const res = await wh.send(data.content, { username: options?.options?.username });
            console.log('res2', res);
        }
        // return api.applications(this.client.user?.id).callback.post({ data });
    }


    get member(): GuildMember | undefined {
        return this._member;
    }


}
