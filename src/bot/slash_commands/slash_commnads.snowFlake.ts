import { SlashCommand } from '../../packages/slash-commands/src/commands/SlashCommand';


export default class SnowFlakeSlashCommand extends SlashCommand {

    public async run(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
