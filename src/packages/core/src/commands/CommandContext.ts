import { CommandUtil } from 'discord-akairo';
import { User } from 'discord.js';
import {
    DMChannel,
    GuildMember,
    MessageOptions,
    NewsChannel,
    TextChannel,
} from 'discord.js';
import { AitherGuild } from '../../../extension/Guild';
import { AitherMessage } from '../../../extension/Message';
import { EMOTES } from '../../../util/Constants';
import { CustomCommand } from './CustomCommand';
export type TextbasedChannel = AitherMessage['channel'];
export class CommandContext<Iargs extends Record<string, unknown>, IChannel extends TextChannel | DMChannel | NewsChannel> {

    private readonly _msg: AitherMessage;
    private readonly _command: CustomCommand;
    private readonly _args: Partial<Iargs>;
    public constructor(
        msg: AitherMessage,
        command: CustomCommand,
        args: Iargs,
    ) {

        this._msg = msg;
        this._command = command;
        this._args = args;
    }

    async send(content: string, options?: MessageOptions): Promise<AitherMessage> {
        return (
            this.util ||
            this.channel

        ).send(content, options || {}) as unknown as AitherMessage;
    }

    public async loading(content: string): Promise<AitherMessage> {
        return (
            this.util ||
            this.channel
        ).send(`${this.emote('loading')} ${content}`) as unknown as AitherMessage;
    }

    async sendNew(content: string): Promise<AitherMessage> {
        return this.channel.send(content) as Promise<AitherMessage>;
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
        return EMOTES.CUSTOM[emote];
    }

    /**
     * the arguments of the command
     */
    public get args(): Partial<Iargs> {
        return this._args;
    }

    /**
     * the msg object that was send by the user
     */
    public get msg(): AitherMessage {
        return this._msg;
    }
    /**
     * the CommandUtil for handling message edits
     */
    public get util(): CommandUtil | undefined {
        return this.msg.util;
    }

    /**
     * the channel the message was send to
     */
    public get channel(): IChannel {
        return this.msg.channel as unknown as IChannel;
    }

    /**
     * the Guild of the Channel the message was send to
     */
    public get guild(): AitherGuild | null {
        return this.msg.guild;
    }
    /**
     * the GuildMember of that Message author
     */
    public get member(): GuildMember | null {
        return this.msg.member;
    }
    /**
     * the command that requires the Context
     */
    public get command(): CustomCommand {
        return this._command;
    }

    public get author(): User {
        return this.msg.author;
    }
}


export class GuildCommandContext<IArgs extends Record<string, unknown>> extends CommandContext<IArgs, TextChannel> {
    get guild(): AitherGuild {
        return this.msg.guild as AitherGuild;
    }

    get member(): GuildMember {
        return this.msg.member as GuildMember;
    }
}
