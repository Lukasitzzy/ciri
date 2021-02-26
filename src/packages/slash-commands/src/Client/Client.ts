/* eslint-disable no-case-declarations */
import { EventEmitter } from 'events';
import { join } from 'path';
import { DiscordBot } from '../../../core/src/client/Client';
import { InterActionCommand } from '../commands/InteractionCommand';
import { InteractionCommandManager } from '../commands/InteractionCommandManager';
import { Api } from '../types/Discord.js.Api';
import { IWSResponse } from '../types/InteractionTypes';
import { InteractionResponseType, InteractionType } from '../util/Constants';

export class InteractionClient extends EventEmitter {
    private readonly _client: DiscordBot;

    private readonly _commandManager: InteractionCommandManager;
    public constructor(client: DiscordBot) {
        super({ captureRejections: true });
        this._client = client;
        this.start();


        this._commandManager = new InteractionCommandManager(this, client);
    }

    async getApplicationID(): Promise<string> {
        return this._getID();
    }

    async start(): Promise<void> {
        this.on('debug', (m) => this._client.logger.debug(m));

    }




    public async handle(data: IWSResponse): Promise<{ type: number; }> {
        console.log(data.member?.permissions);
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
                    this.emit('debug', `did not respond to command "${data.data.name}".`);
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
            await this._runCommand(command);
            return pr;
        default:
            throw new Error('invalid response type');

        }
    }

    public on(event: 'debug', handler: (message: string) => void): this;
    public on(event: 'runCommand', handler: (interaction: InterActionCommand) => void): this;
    public on(event: string, handler: (interaction: any) => void): this {
        return super.on(event, handler);
    }

    get client(): DiscordBot {
        return this._client;
    }

    private async _getID(): Promise<string> {

        if (this._client.user) return this._client.user.id;
        return (await this._client.fetchApplication()).id;
    }
    private async _runCommand(command: InterActionCommand) {
        this.emit('runCommand', command);
        const path = join(process.cwd(), 'dist', 'bot', 'slash_commands', `${command.name}.js`);

        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const cmd = require(path).default;
            if (!cmd) return null;
            const comm = new cmd();
            comm._interaction = command;
            await comm.run();

        } catch (error) {
            if (/Cannot find module/g.test(error.message)) {
                return null;
            }
            this.client.logger.error(error, `commandRun.${command.commandID}:${command.name}`);
        }
    }
    get commandManager(): InteractionCommandManager {
        return this._commandManager;
    }
}

export function getApi(client: DiscordBot): Api {
    return Reflect.get(client, 'api');
}
