import { SlashCommand } from '../../packages/slash-commands/src/commands/SlashCommand';
import { TextChannel } from 'discord.js';
export default class BalanceCommand extends SlashCommand {

    public async run(): Promise<void> {
        const { bank } = (this.interaction.guild ?
            this.client.db.economy.get(this.interaction.guild.id) || await this.client.db.economy.fetch(this.interaction.guild.id)
                .then(res => res)
                : null) || { bank: null, prefix: '$' };

        if (!bank?.accounts?.length) {
            return this.interaction.reply({ content: 'this server does not have a bank ', ephemeral: true });
        }

        const account = bank?.accounts.find(account => account.owner_id === this.interaction.user?.id);
        const banks = await this.client.db.economy.fetchAll();

        if (!account) {
            return this.interaction.reply({ content: 'you do not have a account, please create one with `/account create`', ephemeral: true });
        }

        const locked = account.locked;
        const completeLock = banks.every(bank => bank.bank.accounts.some(acc => acc.owner_id === this.interaction.user?.id && acc.locked));
        if (completeLock) {
            return this.interaction.reply({
                content: [
                    `${this.interaction.emote('error')} you have been completly locked on all your account`,
                    'please solve this issue before you can use your account again'
                ].join(' '),
                ephemeral: true
            });
        }
        let total: number;
        if (banks.length) {
            total = 0;
            for (const bank of banks) {
                const _account = bank.bank.accounts.find(acc => acc.owner_id === this.interaction.user?.id);
                if (_account && !_account.locked) {
                    total += _account.vault;
                }
            }
        } else {
            total = account.vault;
        }

        return this.interaction.reply({
            content: [
                `${this.interaction.emote('info')} your bank accounts vaults.`,
                locked ? 'this account is currently locked' :`${this._parseNumber(account.vault)} <:bonk:824866842957840384> coins`,
                `your total money is ${this._parseNumber(total)}<:bonk:824866842957840384> coins `
            ].join('\n'),
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
