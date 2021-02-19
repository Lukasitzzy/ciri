/* eslint-disable no-case-declarations */
import { Guild } from 'discord.js';
import { EventEmitter } from 'events';
import { DiscordBot } from '../../../core/src/client/Client';
import { InterActionCommand } from '../commands/InteractionCommand';
import { Api } from '../types/Discord.js.Api';
import { IWSResponse } from '../types/InteractionTypes';
import { InteractionResponseType, InteractionType } from '../util/Constants';

export class InteractionClient extends EventEmitter {

    private _started: boolean;

    private readonly _client: DiscordBot;

    public constructor(client: DiscordBot) {
        super({ captureRejections: true });
        this._started = false;
        this._client = client;

    }


    public async handle(data: IWSResponse): Promise<{ type: number; }> {
        if (!data) return { type: InteractionResponseType.PONG };
        switch (data.type) {
            case InteractionType.PING:

                return {
                    type: InteractionResponseType.PONG
                };

            case InteractionType.APPLICATION_COMMAND:
                let timeout = false;
                let resolve: (value: { type: number; }) => void;
                const pr = new Promise<{ type: number; }>((r) => {
                    resolve = r;
                    this._client.setTimeout(() => {
                        timeout = true;
                        this.emit('debug', `running command ${data.data.name} but no response was set`);
                        r({
                            type: InteractionResponseType.ACKNOWLEDGE
                        });
                    }, 1000);
                });
                const handle: Record<string, (options: { hideSource: boolean; }) => void> = {
                    ack(): void {
                        if (!timeout) {
                            resolve({
                                type: InteractionResponseType.ACKNOWLEDGE
                            });
                        }
                    }
                };
                const command = new InterActionCommand(
                    this._client,
                    data,
                    handle
                );

                this.emit('new', command, command.guild);

                return pr;
            default:
                throw new Error('invalid response type');

        }
    }






    public on(event: 'new', handler: (interaction: InterActionCommand, guild?: Guild) => void): this;
    public on(event: string, handler: (interaction: any, guild?: Guild) => void): this {
        return super.on(event, handler);
    }


}

export function getApi(client: DiscordBot): Api {
    return Reflect.get(client, 'api');
}
