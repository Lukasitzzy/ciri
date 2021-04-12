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
                content: `${this.interaction.user} is 200% gey`,
             });
        }
        else {
            const level = (parseFloat(user.id.split('').reverse().join('')) / (10 ** user.id.length) * 100).toFixed(2);
            return this.interaction.reply({
                content: `<@${user.id}> is ${level}% gey`,
                options: {
                    allowedMentions: {
                        parse: ['everyone']
                    }
                }
            });
        }

    }


}
