import { CommandUtil } from 'discord-akairo';
import {
    DMChannel, NewsChannel, TextChannel,
    Message, Guild, GuildMember, MessageOptions
} from 'discord.js';
import { EMOTES } from '../../../util/Constants';
import { CustomCommand } from './CustomCommand';
export type TextbasedChannel = Message['channel'];
export class CommandContext<Iargs extends Record<string, unknown>, IChannel extends TextChannel | DMChannel | NewsChannel> {

    private readonly _msg: Message;
    private readonly _command: CustomCommand;
    private readonly _args: Iargs;
    public constructor(
        msg: Message,
        command: CustomCommand,
        args: Iargs,
    ) {
        console.log(args);

        this._msg = msg;
        this._command = command;
        this._args = args;
    }

    async send(content: string, options?: MessageOptions): Promise<Message> {
        return (
            this.util ||
            this.channel

        ).send(content, options || {}) as unknown as Message;
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
    public get args(): Iargs {
        return this._args;
    }

    /**
     * the msg object that was send by the user
     */
    public get msg(): Message {
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
    public get guild(): Guild | null {
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
}