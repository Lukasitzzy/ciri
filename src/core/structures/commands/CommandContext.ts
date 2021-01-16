import { Message } from "discord.js";
import { CustomCommand } from "./Command";

/**
 * the mixed context to have everything in one class folr easier access.
 * 
 * general idea stolen from the discord.py commands internal framework
 */
export class CommandContext<Targs extends Record<string, unknown>> {

    private readonly _msg: Message;
    private readonly _prefix?: string;
    private readonly _command: CustomCommand;
    private readonly _args: Targs;
    /**
     * initialise a new Command context
     * @param msg the message that was send
     * @param command the command that requires the context.
     * @param args the arguments for that command
     */
    constructor(
        msg: Message,
        command: CustomCommand,
        args: Targs,

    ) {
        this._msg = msg;
        this._command = command;
        this._args = args;
        this._prefix = msg.util?.parsed?.prefix;
    }



    /**
     * the command that requires the context.
     */
    get command(): CustomCommand {
        return this._command;
    }
    /**
     * the message that was send
     */
    get msg(): Message {
        return this._msg;
    }
    /**
     * the arguments for that command
     */
    get args(): Targs {
        return this._args;
    }

    /**
     *  a shortcut to get the server's prefix
     * @nullable
     */
    get prefix(): string | null {
        return this._prefix || null;
    }



}