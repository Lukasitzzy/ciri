import { SlashCommand } from '../../packages/slash-commands/src/commands/SlashCommand';
import { SnowflakeUtil, MessageEmbed } from 'discord.js';

export default class SnowFlakeSlashCommand extends SlashCommand {

    public async run(): Promise<void> {
        const name = this.interaction.data?.data.options?.[0].name;

        const snowflake = this.interaction.data?.data.options?.[0].value;
        if (typeof snowflake !== 'string') {
            return this.interaction.fail({
                content: `invalid value for ${name || 'snow_flake'} wanted string got ${typeof snowflake}`,
                ephemeral: true
            });
        }
        if (snowflake) {
            if (!/\d+/g.test(snowflake)) {
                return this.interaction.fail({
                    content: 'invalid snowflake id',
                    ephemeral: true
                });
            }
            const {
                binary,
                date,
                timestamp
            } = SnowflakeUtil.deconstruct(snowflake);

            if (date) {
                const content = [
                    `date: \`${this._parseTime(date)}\` `,
                    `Binary: \`${binary}\``,
                    `timestamp: \`${timestamp}\` `,
                    '',
                    '',
                    '[reference](https://discord.com/developers/docs/reference#snowflakes)'
                ].join('\n');

                return this.interaction.success({
                    content: `successfully parsed the snowflake \`${snowflake}\` `,
                    // ephemeral: true,
                    options: {
                        embeds: [
                            new MessageEmbed()
                                .setColor(0xd287ff)
                                .setDescription(content)
                                .setAuthor(
                                    `Slash commands powered by ${this.client.user?.username} `,
                                    this.client.user?.displayAvatarURL({ dynamic: true, size: 512 })
                                )
                                .setFooter(`requested by ${this.interaction.user?.username}`)
                        ]
                    }
                });
            }
        }


    }

    private _parseTime(date: Date) {

        const newstr = '{{days}}/{{months}}/{{years}} {{hours}}:{{minutes}} {{tz}}';


        const day = this._parseNumber(date.getUTCDate());

        const month = this._parseNumber(date.getMonth() + 1);
        const year = date.getFullYear();
        const hour = this._parseNumber(date.getHours());
        const minute = this._parseNumber(date.getMinutes());
        const tz = Number(hour) >= 12 ? 'pm' : 'am';


        return newstr.replace(
            /{{days}}/g, day
        ).replace(
            /{{months}}/g, month
        ).replace(
            /{{years}}/g, year.toString()
        ).replace(
            /{{hours}}/g, hour
        ).replace(
            /{{minutes}}/g, minute
        ).replace(
            /{{tz}}/g,
            tz
        );
    }

    private _parseNumber(n: number): string {
        return n < 10 ? `0${n}` : n.toString();
    }

}
