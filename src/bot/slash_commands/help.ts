import { SlashCommand } from '../../packages/slash-commands/src/commands/SlashCommand';
import { TextChannel } from 'discord.js';

export default class HelpSlashCommand extends SlashCommand {

    public run(): void | Promise<void> {
        console.log(this.interaction.options);
    }    

    async userPermissions(): Promise<boolean> {

        return (this.interaction.member && this.interaction.channel?.isText() &&
            (this.interaction.channel as TextChannel)
            .permissionsFor(this.interaction.member)
            .has('SEND_MESSAGES')) || false;
    }
}
