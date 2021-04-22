import { SlashCommand } from '../../packages/slash-commands/src/commands/SlashCommand';
import { TextChannel } from 'discord.js';
import { InterActionCommand } from '../../packages/slash-commands/src/commands/InteractionCommand';
export default class BalanceCommand extends SlashCommand {

    constructor() {
        super('balance');
    }


    public async run(interaction: InterActionCommand): Promise<void> {
       return interaction.reply({ content: 'reeeeeeeeeeeeeeeee' });
    }

    private _parseNumber(num: number) {
        return num.toLocaleString();
    }

    async userPermissions(interaction: InterActionCommand): Promise<boolean> {

        return !(interaction.member && interaction.channel?.isText() &&
            (interaction.channel as TextChannel)
                .permissionsFor(interaction.member)
                .has('SEND_MESSAGES')) || false;
    }
}
