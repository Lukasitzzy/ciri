import { InterActionCommand } from '../../packages/slash-commands/src/commands/InteractionCommand';
import { SlashCommand } from '../../packages/slash-commands/src/commands/SlashCommand';

export default class HelpSlashCommand extends SlashCommand {

    /**
     *
     */
    constructor() {
        super('help');
        
    }

    public async run(interaction: InterActionCommand): Promise<void> {
        if (!interaction.data) return;

        const users = Object.keys(interaction.data?.data.resolved?.users || {});
        let user: { id: string } | undefined;
        for (const _user of users) {
            if (Object.prototype.hasOwnProperty.call(interaction.data.data.resolved?.users, _user)) {
                user = this.client.users.add(interaction.data.data.resolved?.users?.[_user]);
            }
        }
        if (!user) {
            return interaction.reply({
                content: 'you want to bonk.. yourself?',
                ephemeral: true
             });
        }
        else {
            return interaction.reply({
                content: `<a:bonk:818200309452243025> ${interaction.member || interaction.user} bonked ${user.id} <a:bonk:818200309452243025>`,
                ephemeral: true
            });
        }

    }


}
