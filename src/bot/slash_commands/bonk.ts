import { SlashCommand } from '../../packages/slash-commands/src/commands/SlashCommand';

export default class HelpSlashCommand extends SlashCommand {

    public async run(): Promise<void> {
        if (!this.interaction.data) return;

        const users = Object.keys(this.interaction.data?.data.resolved?.users || {});
        let user: { id: string } | undefined;
        for (const _user of users) {
            if (Object.prototype.hasOwnProperty.call(this.interaction.data.data.resolved?.users, _user)) {
                user = this.interaction.data.data.resolved?.users?.[_user];
            }
        }
        if (!user) {
            return this.interaction.reply({
                content: 'you want to bonk.. yourself?',
                ephemeral: true
             });
        }
        else {
            return this.interaction.reply({
                content: `<a:bonk:818200309452243025> ${this.interaction.member || this.interaction.user} bonked <@${user.id}> <a:bonk:818200309452243025>`,
                ephemeral: true
            });
        }

    }


}
