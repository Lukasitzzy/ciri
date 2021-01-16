import { Message } from "discord.js";
import { CustomCommand } from "./Command";

/**
 * the mixed context to have everything in one class folr easier access.
 * 
 * general idea stolen from the discord.py commands internal framework
 */
export class CommandContext<Targs extends Record<string, unknown>> {

    readonly #msg: Message;
    readonly #prefix?: string;
    readonly #command: CustomCommand;
    readonly #args: Targs;
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
        this.#msg = msg;
        this.#command = command;
        this.#args = args;
        this.#prefix = msg.util?.parsed?.prefix;
    }



    /**
     * the command that requires the context.
     */
    get command(): CustomCommand {
        return this.#command;
    }
    /**
     * the message that was send
     */
    get msg(): Message {
        return this.#msg;
    }
    /**
     * the arguments for that command
     */
    get args(): Targs {
        return this.#args;
    }

    /**
     *  a shortcut to get the server's prefix
     * @nullable
     */
    get prefix(): string | null {
        return this.#prefix || null;
    }



}