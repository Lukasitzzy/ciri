import { SlashCommand } from '../../packages/slash-commands/src/commands/SlashCommand';
import { TextChannel } from 'discord.js';
import { IApplicationCommand } from '../../packages/util/typings/InteractionTypes';
import { InterActionCommand } from '../../packages/slash-commands/src/commands/InteractionCommand';
export default class HelpSlashCommand extends SlashCommand {

    /**
     *
     */
    constructor() {
        super('help');
        
    }


    public async run(interaction: InterActionCommand): Promise<void> {

        const commands = await this.client.interaction.commands.fetch();
        const serverCommands: IApplicationCommand[] = [];
        if (interaction.guild) {
            const _commands = await this.client.interaction.commands.fetch(interaction.guild.id);
            serverCommands.push(..._commands);
        }
        const command = interaction.options?.[0];

        if (command) {
            if (typeof command.value === 'string') {
                const content: string[] = [];
                content.push(`help for ${interaction.name}\n${interaction.data?.data.description}`);
                const _command = await this.client.interaction.commands.fetchCommand(command.value).catch(() => null);
                if (_command) {
                    content.push(this._parseCommand(_command));
                    return interaction.reply({
                        content: content.join('\n'),
                        ephemeral: true
                    });
                } else {
                    return interaction.reply({
                        content: 'command not found',
                        ephemeral: true
                    });
                }
            }
        } else {
            const content = [
                commands.map(
                    command => `\`/${command.name}\`: ${command.description}`
                ).join('\n'),
                serverCommands.length ?
                    `\n\n**server specific commands**:\n${serverCommands.map(
                        command => `\`/${command.name}\`: ${command.description}`
                    ).join('\n')}`
                    : ''
            ].filter(c => c !== '').join('\n');

            return interaction.reply({
                content: content,
                ephemeral: true
            });
        }

    }

    private _parseCommand(command: IApplicationCommand) {
        const {
            description: _description,
            name: _name,
            options: _options
        } = command;

        return [
            `name: ${_name}`,
            `description: ${_description}`,
            _options?.length ?
                _options.map(option => {
                    console.log((option as any).type);
                    return option.name;
                })
                : ''
        ].filter(v => v !== '').join('\r\n');
    }

    async userPermissions(interaction: InterActionCommand): Promise<boolean> {

        return (interaction.member && interaction.channel?.isText() &&
            (interaction.channel as TextChannel)
                .permissionsFor(interaction.member)
                .has('SEND_MESSAGES')) || false;
    }
}
