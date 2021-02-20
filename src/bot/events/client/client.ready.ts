import { Listener } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { DiscordBot } from '../../../packages/core/src/client/Client';
declare module 'discord.js' {
    interface PresenceData {
        activities: {
            type: ActivityType,
            name: string,
            utl?: string;
        }[];
    }
}

export default class ClientReadyEvent extends Listener {
    client!: DiscordBot;
    constructor() {
        super('client.ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    async exec(): Promise<void> {
        this.client.interaction.on('new', async (command) => {
            await command.ephemeral('success!');
            await command.send({
                content: 'success',
                options: {
                    username: 'test username',
                    embeds: [
                        new MessageEmbed({
                            color: 0x00f00f,
                            description: [
                                'this is a test reponse'
                            ].join('\n')
                        }),
                        new MessageEmbed({
                            color: 0x00f00f,
                            description: 'this is another embed.'
                        })
                    ]
                }
            });
        });
        this.client.user?.setPresence({
            activities: [{
                name: 'with 0.0.1% math knowledge',
                type: 'PLAYING'
            }],
            status: 'dnd'
        });
        console.log(`[READY] ${this.client.user?.tag} is now ready. `);
    }
}
