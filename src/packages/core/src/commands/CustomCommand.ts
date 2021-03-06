import { Command, CommandOptions } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { AitherMessage } from '../../../extension/Message';
import { CommandDescription } from '../../../util/typings/util';
import { AitherBot } from '../client/Client';
import { CommandContext } from './CommandContext';

export abstract class CustomCommand extends Command {
    client!: AitherBot;
    public description!: CommandDescription;

    public subcommand: boolean;

    /**
         *
         */
    constructor({
        id,
        options,
        subCommand,
        description,

    }: {
        id: string;
        subCommand: boolean;
        options: CommandOptions;
        //TODO: add description typing
        description: CommandDescription;
    }) {
        super(id, options);
        this.description = description;

        this.subcommand = typeof subCommand === 'undefined' ? false : !!subCommand;
    }


    run?(ctx: CommandContext<Record<string, unknown>, AitherMessage['channel']>): Promise<unknown>;



    abstract help(prefix: string): MessageEmbed;



    public async exec(msg: AitherMessage, args: Record<string, unknown>): Promise<void> {

        try {
            const ctx = new CommandContext(
                msg,
                this,
                args
            );

            if (this.run) {
                await this.run(ctx);
            }
        } catch (error) {
            //
        }


    }
}
