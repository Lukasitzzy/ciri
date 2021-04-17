/* eslint-disable no-case-declarations */
import { EventEmitter } from 'events';
import { join } from 'path';
import { DiscordBot } from '../../../core/src/client/Client';
import { InterActionCommand } from '../commands/InteractionCommand';
import { InteractionCommandManager } from '../commands/InteractionCommandManager';
import { IWSResponse } from '../../../util/typings/InteractionTypes';
import { InteractionType } from '../util/Constants';
import { SlashCommand } from '../commands/SlashCommand';
import { Cache } from '../../../util/Cache';
import { enumerable } from '../../../util/decorators';
import { promises, statSync } from 'fs';
export class InteractionClient extends EventEmitter {
    private readonly _client: DiscordBot;
    private readonly _commandManager: InteractionCommandManager;
    @enumerable
    private readonly _dir: string;
    public readonly modules: Cache<string, SlashCommand>;
    public constructor(client: DiscordBot, dir: string) {
        super({ captureRejections: true });
        this._client = client;
        this._commandManager = new InteractionCommandManager(this, client);

        this.modules = new Cache<string, SlashCommand>();
        this._dir = dir;
    }

    async getApplicationID(): Promise<string | undefined> {
        return this._getID();
    }


    async loadCommands(): Promise<void> {
        const all = await (async function readRecursive(_dir: string): Promise<string[]> {
            const res: string[] = [];
            const files = await promises.readdir(_dir);
            for (const file of files) {
                const filepath = join(_dir, file);
                if (statSync(filepath).isDirectory()) {
                    readRecursive(filepath);
                } else {
                    res.push(filepath);
                }
            }
            return res;
        })(this._dir);

        for (const file of all) {
            const ctor = await import(file).catch(() => null);
            if (!ctor) continue;
            try {
                const command: SlashCommand = new ctor.default();

                command.client = this.client;
                if (this.modules.has(command.name)) continue;
                this.modules.set(command.name, command);

            } catch (error) {
                continue;
            }
        }

    }


    public async handle(data: IWSResponse): Promise<InterActionCommand | void> {
        if (!data) return;
        switch (data.type) {
            case InteractionType.PING:
                this.client.logger.debug('got PING command  ignoring ', 'interaction_create');
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
                if (command.name === 'test') {
                    return command.reply({ ephemeral: true, content: 'yes even here <:items4Lurk:814620882663637084> <- twitch emote btw' });
                }

                this._client.setTimeout(async () => {
                    if (!command._responded) {
                        this.emit('debug', `did not respond to command "${data.data.name}".`);
                        await command.defer();
                        return;
                    } else {
                        this.emit('debug', 'failed to respond to command, using default fallback');
                        // await command.fail({ content: 'this command is not yet available ', ephemeral: true });
                    }
                    return;
                }, 2500);
                try {
                    await this._runCommand(command);

                } catch (err) {
                    await command.panik({ error: err });
                    this.client.logger.error(err, command.id);
                }
                return command;
            default:
                throw new Error('invalid response type');
        }
    }

    get client(): DiscordBot {
        return this._client;
    }
    private async _getID(): Promise<string | undefined> {
        if (this._client.user) return this._client.user.id;
        return this.client.fetchApplication().then(res => res?.id);
    }

    private async _runCommand(ctx: InterActionCommand) {
        this.emit('runCommand', ctx);

        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const cmd = this.modules.get(ctx.name);
            console.log(cmd?.name);
            
            if (cmd) {
                if (cmd.clientPermissions) {
                    const r = await cmd.clientPermissions(ctx);
                    if (r) {
                        return this.emit('commandBlocked', ctx, cmd, 'ClientPermission');
                    }
                }
                if (cmd.userPermissions) {
                    const c = await cmd.userPermissions(ctx);
                    if (c) {
                        return this.emit('commandBlocked', ctx, cmd, c.toString());
                    }
                }
                await cmd.run(ctx);
            } else {
                return;
            }
        } catch (error) {

            await ctx.panik({ error });

            this.client.logger.error(error, `SlashcommandRun:${ctx.name}`);
        }
    }

    get commandManager(): InteractionCommandManager {
        return this._commandManager;
    }

    get commands(): InteractionCommandManager {
        return this._commandManager;
    }

    public on(event: 'commandBlocked', handler: (interaction: InterActionCommand, cmd: SlashCommand, reason: string) => void): this;
    public on(event: 'debug', handler: (message: string) => void): this;
    public on(event: 'runCommand', handler: (interaction: InterActionCommand) => void): this;
    public on(event: string, handler: (interaction: any, cmd: any, reason: any) => void): this {
        return super.on(event, handler);
    }
    public emit(event: 'commandBlocked', ...args: [InterActionCommand, SlashCommand, string]): boolean;
    public emit(event: 'debug', ...args: [string]): boolean;
    public emit(event: 'runCommand', ...args: [InterActionCommand]): boolean;
    public emit(event: string, ...args: any[]): boolean {
        return super.emit(event, ...args);
    }
}

