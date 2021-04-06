import { SlashCommand } from '../../packages/slash-commands/src/commands/SlashCommand';
import { TextChannel } from 'discord.js';

export default class BalanceCommand extends SlashCommand {

    public async run(): Promise<void> {
        const accounts = this.interaction.guild ? 
            this.client.db.economy.get(this.interaction.guild.id)?.bank.accounts || await this.client.db.economy.fetch(this.interaction.guild.id)
            .then(res => res?.bank.accounts)
            : null;
        // console.log(accounts);
        
        if (!accounts?.length) {
            return this.interaction.reply({ content: 'this server does not have a bank ', ephemeral: true });
        }

        const account = accounts.find(account => account.owner_id === this.interaction.user?.id);

        if (!account) {
            return this.interaction.reply({ content: 'you do not have a account, please create one with `/account create`', ephemeral: true});
        }
        return this.interaction.reply({
            content: `${this.interaction.emote('info')} you have currently ${this._parseNumber(account.vault)} bonkcoins <:bonk:828675485391257661> <:ogNayaSip:795051648644546582>`,
            ephemeral: true
        });



    }

    private _parseNumber(num: number) {
        return num.toLocaleString();
    }

    async userPermissions(): Promise<boolean> {

        return (this.interaction.member && this.interaction.channel?.isText() &&
            (this.interaction.channel as TextChannel)
                .permissionsFor(this.interaction.member)
                .has('SEND_MESSAGES')) || false;
    }
}
