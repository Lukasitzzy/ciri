import { CommandUtil } from 'discord-akairo';
import {
    DMChannel, NewsChannel, TextChannel,
    Message, Guild, GuildMember
} from 'discord.js';
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

        this._msg = msg;
        this._command = command;
        this._args = args;
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