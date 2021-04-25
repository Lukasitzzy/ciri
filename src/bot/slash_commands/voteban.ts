import { MessageEmbed } from 'discord.js';
import { AitherUser } from '../../packages/extentions/User';
import { InterActionCommand } from '../../packages/slash-commands/src/commands/InteractionCommand';
import { SlashCommand } from '../../packages/slash-commands/src/commands/SlashCommand';

const EMOTES = {
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '6️⃣',
    7: '7️⃣',
    8: '8️⃣',
    9: '9️⃣',
    0: '0️⃣'
};
export default class HelpSlashCommand extends SlashCommand {

    constructor() {
        super('voteban');

    }

    public async run(interaction: InterActionCommand): Promise<void> {
        if (!interaction.data) return;

        if (!this.client.db.users || !this.client.db.users.collection) {
                return interaction.fail({
                    content: 'database not ready',
                    ephemeral: true,
                });
        }

        const users = Object.keys(interaction.data?.data.resolved?.users || {});
        let user: AitherUser | undefined;
        for (const _user of users) {
            if (Object.prototype.hasOwnProperty.call(interaction.data.data.resolved?.users, _user)) {
                user = this.client.users.add(interaction.data.data.resolved?.users?.[_user]) as AitherUser;
            }
        }
        if (!user) {
            return interaction.reply({
                content: 'you want to voteban.. yourself?',
                ephemeral: true
            });
        }
        else {

            let userData = await this.client.db.users.collection.findOne({ userID: user.id });
            let userData2 = await this.client.db.users.collection.findOne({ userID: interaction.user?.id });
            if (!userData) {
                userData = {
                    bonkedCount: 0,
                    userID: user.id,
                    selfVotebannedCount: 0,
                    voteBannedCount: 0
                };
            }
            
            if (!userData2) {
                userData2 = {
                    bonkedCount: 0,
                    selfVotebannedCount: 0,
                    userID: interaction.user!.id,
                    voteBannedCount: 0
                };
            }


            userData.voteBannedCount += 1;
            userData2.selfVotebannedCount += 1;
            const method = userData.voteBannedCount === 1 ? 'insert' : 'update';
            const method2 = userData2.selfVotebannedCount === 1 ? 'insert' : 'update';
            let res = false,
                res2 = false;
            if (method === 'insert') {
                const _res = await this.client.db.users.collection.insertOne(userData);

                if (_res.insertedCount !== 1) {
                    res = true;
                }
            } else {
                res = await this.client.db.users.collection.updateOne({ userID: userData.userID }, {
                    $set: userData
                }).then(w => w.modifiedCount !== 1);
                if (method2 === 'insert') {
                    const _res2 = await this.client.db.users.collection.insertOne(userData2);
                    if (_res2.insertedCount !== 1) {
                        res2 = true;
                    }
                } else {
                    res = await this.client.db.users.collection.updateOne({ userID: userData2.userID }, {
                        $set: userData2
                    }).then(w => w.modifiedCount !== 1);
                }
                console.log(res);
            }
            if (res || res2) {


                return interaction.fail({
                    content: 'failed to vote ban the user, database returned invalid result',
                    ephemeral: true
                });
            }
            const embed = new MessageEmbed().setColor('#32603b');
            embed.setDescription([
                `**${user.username}** has been banned **${this._parseEmote(userData.voteBannedCount)} times**`,
                `**${interaction.user?.username}** has banned others ${this._parseEmote(userData2.selfVotebannedCount)} times`,
                '**Ban Message**:',
              interaction.options?.[1].value || `${user.username} should not be here!`,

            ]).setAuthor(`${user.username} was banned by ${interaction.user?.username}`)
                .setFooter('Idea based on: git.io/voteban | ',)
                .setTimestamp();

            return interaction.reply({
                content: '',
                options: {
                    embeds: [embed]
                }
                // ephemeral: true
            });
        }

    }

    private _parseEmote(num: number) {
        const strarr = num.toString().split('');
        return strarr.map(s => {
            return EMOTES[+s as 0];
        }).join('');
    }


}
