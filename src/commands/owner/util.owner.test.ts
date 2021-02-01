
import { Guild } from 'discord.js';
import { CustomCommand } from '../../core/structures/commands/Command';
import { CommandContext } from '../../core/structures/commands/CommandContext';
export default class TestCommand extends CustomCommand {

    constructor() {
        super({
            id: 'util.owner.test',
            options: {
                aliases: ['test'],
                ownerOnly: true,
                args: [{
                    id: 'guild',
                    type: 'guild'
                }]
            }
        });

    }

    public async run(ctx: CommandContext<{ guild: Guild; }>): Promise<unknown> {



        if (ctx.args.guild) {
            const commands = await this.client.interactions.commands.getCommandsForGuild({ guildID: ctx.args.guild.id });
            console.log(commands.map(command => command.name));
            await ctx.say(`ℹ following commands are available for ${ctx.args.guild.name}.\n${commands.map(command => `/${command.name} :: ${command.description || 'no description.'} `).join('\n')}`);

        } else {
            const commands = await this.client.interactions.commands.getGlobalCommands();
            console.log(commands.map(command => command.name));
            await ctx.say(`ℹ following commands are globally available.\n${commands.map(command => `/${command.name} :: ${command.description || 'no description.'} `).join('\n')}`);
        }
        return;
    }
}