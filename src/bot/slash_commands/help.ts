import { SlashCommand } from '../../packages/slash-commands/src/commands/SlashCommand';
import { TextChannel } from 'discord.js';
import { InteractionResponseType } from '../../packages/slash-commands/src/util/Constants';

export default class HelpSlashCommand extends SlashCommand {

    public async run(): Promise<void> {
        await this.interaction.reply({
            content: 'not yet here',
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            ephemeral: true
        });

    }

    async userPermissions(): Promise<boolean> {

        return (this.interaction.member && this.interaction.channel?.isText() &&
            (this.interaction.channel as TextChannel)
                .permissionsFor(this.interaction.member)
                .has('SEND_MESSAGES')) || false;
    }
}
