import { CustomCommand } from "../../../core/structures/commands/Command";
import { CommandContext, CommandContextNoArgs } from "../../../core/structures/commands/CommandContext";


export class OwnerCreateGlobalSlashCommands extends CustomCommand {



    public async run(ctx: CommandContext<{
        guildID?: string;
    }>): Promise<unknown> {


        const msg = (await ctx.msg.channel.awaitMessages((msg: CommandContextNoArgs['msg']): boolean => {
            return msg.author.id === ctx.author.id;
        }, {
            time: 1000 * 15
        }).catch(() => null))?.first();

        if (!msg || msg.content === 'cancel') {
            await ctx.say('ok fine then don\'t');
        }



        return;
    }






}