import { SlashCommand } from '../../packages/slash-commands/src/commands/SlashCommand';
import { SnowflakeUtil } from 'discord.js';

export default class SnowFlakeSlashCommand extends SlashCommand {

    public async run(): Promise<void> {

        const data = this.interaction.data?.data.options?.[0].value;
        if (typeof data !== 'string') return;
        if (data) {
            if (!/\d+/g.test(data)) {
                return this.interaction.reply({
                    content: ':x: invalid snowflake id',
                    ephemeral: true
                });
            }
            const {
                binary,
                date,
                timestamp
            } = SnowflakeUtil.deconstruct(data);

            if (date) {
                const content = [
                    `date: \`${date.toLocaleDateString()}\` `,
                    `Binary: \`${binary}\``,
                    `timestamp: \`${timestamp}\` `
                ].join('\n');

                return this.interaction.reply({
                    content,
                    ephemeral: true
                });
            }




        }


    }
}
