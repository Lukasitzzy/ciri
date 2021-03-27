/* eslint-disable no-case-declarations */
import { EventEmitter } from 'events';
import { join } from 'path';
import { DiscordBot } from '../../../core/src/client/Client';
import { InterActionCommand } from '../commands/InteractionCommand';
import { InteractionCommandManager } from '../commands/InteractionCommandManager';
import { IWSResponse } from '../types/InteractionTypes';
import { InteractionType } from '../util/Constants';

export class InteractionClient extends EventEmitter {
    private readonly _client: DiscordBot;
    private readonly _commandManager: InteractionCommandManager;
    private readonly _test: any;
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

    public async handle(data: IWSResponse): Promise<void> {
        if (!data) return;
        switch (data.type) {
            case InteractionType.PING:
                console.log('got PING command  ignoring ');
                break;
            case InteractionType.APPLICATION_COMMAND:
                if (!data.data) {
                    this.emit('debug', 'failed to parse the command, discord did not send a "data" property');
                    break;
                }
                const command = new InterActionCommand(
                    this._client,
                    data,
                );

                this._client.setTimeout(() => {
                    if (!command.resolved) {
                        this.emit('debug', `did not respond to command "${data.data.name}".`);
                    }
                    // r({
                    //     type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
                    // });
                }, 1000);

                await this._runCommand(command);
                break;
            default:
                throw new Error('invalid response type');

        }
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
            const cmd = (await import(path)).default;
            if (!cmd) return null;
            const comm = new cmd();
            comm._interaction = command;
            await comm.run();

        } catch (error) {
            if (/Cannot find module/g.test(error.message)) {
                return null;
            }
            if (process.env.SHOW_ERROR_TO_USERS) {
                await command.panik({ error });
            }
            this.client.logger.error(error, `commandRun.${command.commandID}:${command.name}`);
        }
    }
    get commandManager(): InteractionCommandManager {
        return this._commandManager;
    }
    get commands(): InteractionCommandManager {
        return this._commandManager;
    }

    public on(event: 'debug', handler: (message: string) => void): this;
    public on(event: 'runCommand', handler: (interaction: InterActionCommand) => void): this;
    public on(event: string, handler: (interaction: any) => void): this {
        return super.on(event, handler);
    }
    public emit(event: 'debug', ...args: [string]): boolean;
    public emit(event: 'runCommand', ...args: [InterActionCommand]): boolean;
    public emit(event: string, ...args: any[]): boolean {
        return super.emit(event, ...args);
    }
}

