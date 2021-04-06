import { Message } from 'discord.js';
import { CommandContext, TextbasedChannel } from '../../../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../../../packages/core/src/commands/CustomCommand';
import { applyOptions } from '../../../../../packages/util/Functions';

@applyOptions({
    id: 'economy.guilds.bank.bank',
    description: {},
    options: {
        aliases: ['bank'],
    }
})
export default class BankCommand extends CustomCommand {



    async run(ctx: CommandContext<any, TextbasedChannel>): Promise<unknown> {

        if (ctx.guild) {
            const settings = await this.client.db.economy.fetch(ctx.guild.id);

            if (!settings?.enabled) {
                return ctx.send(`${ctx.emote('error')} this server does not has economy enabled. `);
            }
            const account = settings.bank.accounts.find(account => account.owner_id === ctx.author.id);

            if (!account) {
                const prefix = ctx.util?.parsed?.prefix || '$';
                return ctx.send(`${ctx.emote('error')} you do not have a account here, please use the command ${prefix}create-account`);
            }

            if (account.password) {
                const msg2 = await ctx.sendNew(`${ctx.emote('info')} you have a password set for this account, sending you a verification...`);
                const msg = await ctx.author.send(`${ctx.emote('info')} please type your password to confirm the view...\n\n type \`cancel\` to cancel `);
                if (msg) {
                    await msg2.edit(`${ctx.emote('loading')} waiting for your verification... `);
                } else {
                    return msg2.edit(`${ctx.emote('error')} failed to verify, canceled command. `);
                }
                const msgs = await msg.channel.awaitMessages((msg: Message) => {
                    return msg.author.id === ctx.author.id;
                }, { max: 1, time: 5000, errors: ['time'] }).catch(() => null);

                if (!msgs || !msgs.size) {
                    await msg.edit(`${ctx.emote('info')} did not responsd after 5 second...`);
                    return msg2.edit(`${ctx.emote('info')} canceled command.`);
                }

                const first = msgs.first();

                if (!first) {
                    await msg.edit(`${ctx.emote('info')} did not responsd after 5 second...`);
                    return msg2.edit(`${ctx.emote('info')} canceled command.`);
                }

                const content = first.content;

                if (content === 'cancel') {
                    await msg.edit(`${ctx.emote('success')} cancel command.`);
                    return msg2.delete();
                }
                console.log(`"${account.password}" :: "${content}" `);
                if (account.password !== content) {
                    await msg.edit(`${ctx.emote('error')} wrong password, please try again.\n\n[canceled command]`);
                    await msg2.delete();
                    return;
                }

                await msg.edit(`${ctx.emote('success')} password matched, your account value is $${account.vault}`);
                await msg2.edit(`${ctx.emote('success')} your account `);
            }

        }
    }


}
