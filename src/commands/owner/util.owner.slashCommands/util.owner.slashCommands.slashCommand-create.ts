import { CustomCommand } from '../../../core/structures/commands/Command';
import { CommandContext } from '../../../core/structures/commands/CommandContext';

export default class OwnerCreateGlobalSlashCommands extends CustomCommand {

    /**
     *
     */
    constructor() {
        super({
            id: 'util.owner.slashCommand.slashCommand-create',
            options: {
                editable: false,
                ownerOnly: true,
                args: [{
                    id: 'name',
                    type: 'string'
                }, {
                    id: 'guild',
                    flag: ['--guild'],
                    match: 'flag',

                }],
                flags: [
                    '--guild'
                ]
            }
        });

    }

    public async run(ctx: CommandContext<{
        guild: boolean;
        name: string | null;
    }>): Promise<unknown> {
        const { name, guild } = ctx.args;
        if (!name || name.length < 3 || name.length > 31) {
            return ctx.say('the command has to be a name **valid** smh');
        }
        if (guild && !ctx.guild) {
            return ctx.say('you cannot create a guild only command inside a dm! smh');
        }
        const all = ctx.guild ?
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            await this.client.interactions.commands.getCommandsForGuild({ guildID: ctx.guild!.id })
            : await this.client.interactions.commands.getGlobalCommands();

        if (all.some(icommand => icommand.name === ctx.args.name)) {
            return ctx.say(`:x: a command with that name already exist.\nIf you want to edit the response, please use {prefix}sc edit ${ctx.args.name}`);
        }
        console.log(name, guild, ctx.guild?.id);


        const res = await this.client.interactions.commands.create({
            name,
            description: 'a test if that is working',
            guildID: guild ? ctx.guild?.id : undefined
        });

        if (!res) {
            return ctx.say('something broke. please try never again.');
        }

        await ctx.say([
            `✅sucessfully created a interaction with the name ${res.name}`,
            'To appear the command can take one hour, but you still can use it.',
            `if you want to delete it run \`${ctx.msg.util?.parsed?.prefix || '$'}sc delete ${res.id}\` `
        ].join('\n'));

        return;
    }






}