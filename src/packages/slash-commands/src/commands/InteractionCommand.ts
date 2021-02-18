import { DiscordAPIError } from 'discord.js';
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


    async reply(content: string, options?: { ephemeral: boolean; }): Promise<any> {

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
        }

        console.log(data);

        data.data.type = data.type;
        const res = await api.interactions(this.id, this.token).callback.post({ data }).catch((err: DiscordAPIError) => {
            if (err instanceof DiscordAPIError) {
                console.log(`[ERROR] failed to respond ${err.code} [${err.httpStatus}|${err.method}] ${err.name} ${err.message} `);
            }
        });

        // return api.applications(this.client.user?.id).callback.post({ data });
    }


}