import { Command, CommandOptions } from 'discord-akairo';
import { Message } from 'discord.js';
import { CommandContext } from './CommandContext';

export abstract class CustomCommand extends Command {


    /**
         *
         */
    constructor({
        id,
        options,
        description,

    }: {
        id: string;
        options: CommandOptions;
        //TODO: add description typing
        description: any;
    }) {
        super(id, options);
        this.description = description;
    }


    abstract run(ctx: CommandContext<Record<string, unknown>, Message['channel']>): any;


    public async exec(msg: Message, args: Record<string, unknown>): Promise<void> {

        try {
            const ctx = new CommandContext(
                msg,
                this,
                args
            );

            await this.run(ctx);
        } catch (error) {
            //
        }


    }
}
