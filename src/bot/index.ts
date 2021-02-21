import { DiscordBot } from '../packages/core/src/client/Client';
import { InteractionResponseType } from '../packages/slash-commands/src/util/Constants';


const client = new DiscordBot(__dirname);

client.start().catch(e => client.logger.error(e));


client.interaction.on('create', interaction => {
    if (interaction.name === 'test') {
        interaction.reply({
            content: 'this is a test message',
            type: InteractionResponseType.CHANNEL_MESSAGE,
            options: {

            }
        });
    } else {
        interaction.reply({
            content: 'this is a test message',
            options: {},
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE
        }).catch(err => {
            client.logger.error(err, interaction.constructor.name);
        });
    }


});
