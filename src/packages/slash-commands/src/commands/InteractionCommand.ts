import { APIMessage, MessageOptions } from 'discord.js';
import { DiscordBot } from '../../../core/src/client/Client';
import { getApi } from '../Client/Client';
import { InteractionBase } from '../Client/Interaction';
import { IWSResponse, iWsResponseData } from '../types/InteractionTypes';

export class InterActionCommand extends InteractionBase {

    private readonly _handle: Record<string, (options: { hideSource: boolean; }) => void>;
    private readonly _commandid: string;
    private readonly _options: iWsResponseData['options'];
    /**
     *
     */
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

        return this;
    }

    ack(hideSource: boolean): void {
        this._handle.ack({ hideSource });
    }



    async ephemeral(content: string): Promise<any> {
        return this.reply(content, { ephemeral: true });
    }

    // async send(content: string) { };


    private async reply(content: string, options?: { ephemeral: boolean; options?: MessageOptions; }): Promise<any> {

        const api = getApi(this.client) as any;

        const data = {
            type: 2,
            data: {
                type: 2,
                content: content,
                flags: 0
            }
        };
        if (!this.client.user?.id) throw new Error('client not ready');
        if (options?.ephemeral) {
            data.data.flags = 64;
            data.type = 3;
            data.data.type = 3;
            const res = await api.interactions(this.id, this.token).callback.post({ data });
            console.log(res);
            return;
        } else {

            console.log(data);

            data.data.type = data.type;
            const obj = APIMessage.create(
                //@ts-ignore
                this,
                content
            ).resolveData();


            const res = await api.webhooks(this.client.user!.id, this.token).post({
                data: obj.data,
                files: obj.files,

            }
            );
        }
        // return api.applications(this.client.user?.id).callback.post({ data });
    }


}
