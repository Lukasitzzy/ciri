import { Command, CommandOptions } from 'discord-akairo';
import { DiscordBotClient } from '../../client/Client';
import { Message } from 'discord.js';
import { CommandContext } from './CommandContext';

/**
 * a custom implementation of discord-akairos command
 * @extends {Command}
 * 
 */
//eslint-disable-next-line
//@ts-ignore
export abstract class CustomCommand extends Command {
    /**
     * the discord client
     */
    public client!: DiscordBotClient;
    /**
     *
     */
    public constructor({
        id,
        options
    }: {
        /**
         * the id of the command
         */
        id: string;
        /**
         * the command options
         */
        options: CommandOptions;
    }) {
        super(id, options);
    }
    /**
     * runs the command inside a custom error handler.
     * if you do not want that override the {@link CustomCommand#exec} method
     * @param ctx the command context that invoked the command
     */
    public abstract run(ctx: CommandContext<Record<string, unknown>>): Promise<unknown>;
    async onError?(msg: Message): Promise<void>;

    /**
     * runs the {@link CustomCommand#run} method and catches errors internally
     * @param msg the message that was send by the user
     * @param args the (parsed) arguments 
     */
    private async exec(msg: Message, args: Record<string, unknown>): Promise<void> {
        const ctx = new CommandContext<typeof args>(
            msg,
            this,
            args
        );
        try {
            await this.run(ctx);
        } catch (error) {
            console.log(`error on command "${this.id}": ${error.name} ${error.message}`);
            if (this.onError) {
                await this.onError(msg);
            } else {
                await ctx.msg.util?.send(`:x: failed to run the ${this.aliases[0]} command.`).catch(errr => console.log(errr.message));
            }
        }

    }
}