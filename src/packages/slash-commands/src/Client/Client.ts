/* eslint-disable no-case-declarations */
import { EventEmitter } from 'events';
import { join } from 'path';
import { DiscordBot } from '../../../core/src/client/Client';
import { InterActionCommand } from '../commands/InteractionCommand';
import { Api } from '../types/Discord.js.Api';
import { IApplicationCommand, IApplicationCommandOption, IWSResponse } from '../types/InteractionTypes';
import { InteractionResponseType, InteractionType } from '../util/Constants';

export class InteractionClient extends EventEmitter {
    private readonly _client: DiscordBot;
    private readonly _commands: string[];
    public constructor(client: DiscordBot) {
        super({ captureRejections: true });
        this._client = client;
        this.start();
        this._commands = [];
    }

    async fetchCommands(): Promise<IApplicationCommand[]> {
        const id = this._client.user?.id || (await this._client.fetchApplication()).id;
        return getApi(this._client).applications(id).commands.get();
    }

    async createCommand(
        name: string,
        description: string,
        options: IApplicationCommandOption[] = []

    ): Promise<IApplicationCommand> {
        const id = this._client.user?.id || (await this._client.fetchApplication()).id;
        return getApi(this._client).applications(id).commands.post({
            data: {
                name,
                description,
                options
            },
            query: {
                wait: true
            }
        });


    }


    async start(): Promise<void> {
        const commands = await this.fetchCommands();

        for (const { name } of commands) {
            this._commands.push(name);
        }

        this.on('debug', (m) => this._client.logger.debug(m));

        this.on('create', async (interaction) => {
            if (interaction.name === 'test-command') {
                console.log(interaction.data?.data);
            }
            if (this._commands.includes(interaction.name)) {
                await this._runCommand(interaction);
            }
        });
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
                console.log(command.permissions?.serialize());


                this.emit('create', command);


                return pr;
            default:
                throw new Error('invalid response type');

        }
    }

    public on(event: 'debug', handler: (message: string) => void): this;
    public on(event: 'create', handler: (interaction: InterActionCommand) => void): this;
    public on(event: string, handler: (interaction: any) => void): this {
        return super.on(event, handler);
    }


    private async _runCommand(command: InterActionCommand) {
        const path = join(process.cwd(), 'dist', 'bot', 'slash_commands', `slash_commands.${command.name}.ts`);

        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const cmd = require(path);
            if (!cmd) return null;
            const comm = new cmd();
            comm._interaction = command;
            await comm.run();

        } catch (error) {
            return null;
        }
    }
}

export function getApi(client: DiscordBot): Api {
    return Reflect.get(client, 'api');
}
