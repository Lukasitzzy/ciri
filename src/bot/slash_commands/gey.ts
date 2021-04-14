import { InterActionCommand } from '../../packages/slash-commands/src/commands/InteractionCommand';
import { SlashCommand } from '../../packages/slash-commands/src/commands/SlashCommand';

export default class HelpSlashCommand extends SlashCommand {

    /**
     *
     */
    constructor() {
        super('bonk');
        
    }

    public async run(interaction: InterActionCommand): Promise<void> {
        if (!interaction.data) return;

        const users = Object.keys(interaction.data?.data.resolved?.users || {});
        let user: { id: string; } | undefined;
        for (const _user of users) {
            if (Object.prototype.hasOwnProperty.call(interaction.data.data.resolved?.users, _user)) {
                user = interaction.data.data.resolved?.users?.[_user];
            }
        }
        if (!user) {
            return interaction.reply({
                content: 'you\'re 200% gey',
            });
        }
        else {
            const level = (parseFloat(user.id.split('').reverse().join('')) / (10 ** user.id.length) * 100).toFixed(2);
            return interaction.reply({
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
