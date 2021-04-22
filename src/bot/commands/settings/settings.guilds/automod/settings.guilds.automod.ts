import { Flag } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { CustomCommand } from '../../../../../packages/core/src/commands/CustomCommand';
import { AitherMessage } from '../../../../../packages/extentions/Message';
import { applyOptions, requireDefaultPermissions, requireGuild } from '../../../../../packages/util/decorators';
@requireDefaultPermissions(['ADMINISTRATOR'])
@applyOptions({
    id: 'settings.guilds.automod',
    description: {},
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
        
        return embed;

    }


}
