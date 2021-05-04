import { Flag } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { CustomCommand } from '../../../../../packages/core/src/commands/CustomCommand';
import { AitherMessage } from '../../../../../packages/extension/Message';
import { applyOptions, requireDefaultPermissions, requireGuild } from '../../../../../packages/util/decorators';
@requireDefaultPermissions(['ADMINISTRATOR'])
@applyOptions({
    id: 'settings.guilds.automod',
    description: {
        text: 'change or list current automod settings.',
        aliases: ['automod'],
        examples: ['{{prefix}}automod enable', '{{prefix}}automod no-invites enable'],
        usage: ['{{prefix}}automod <settings> [...value]']
    },
    options: {
        aliases: ['automod']
    }
})
@requireGuild
export default class GuildAutomodSettingsCommand extends CustomCommand {

    public *args(): Generator<unknown> {

        const method = yield {
            type: [
                ['settings.guilds.automod.enable', 'enable'],
                ['settings.guilds.automod.disable', 'disable'] 
            ],
            otherwise: (msg: AitherMessage) => {

                const prefix = msg.util?.parsed?.prefix || '$';

                return this.help(prefix);
            }
        };

        return Flag.continue(method as string);

    }


    help(prefix: string): MessageEmbed {

        const embed = new MessageEmbed();
        const {text, aliases, usage, examples} = this.description;

        embed.setDescription([
            `**description**\n${text}`,
            `**aliases**: ${aliases.map(alias => `\`${alias}\``).join(' ')}`,
            usage.length ? `**usage**: ${usage.map(us => `\`${us.replace(/{{prefix}}/, prefix)}\``).join(' ')}` : '',
            examples.length ? `**examples**: ${examples.map((example) => `\`${example.replace(/{{prefix}}/, prefix)}\``).join(' ')}` : ''
        ].filter(f => f !== '').join('\n'));
        return embed;

    }


}
