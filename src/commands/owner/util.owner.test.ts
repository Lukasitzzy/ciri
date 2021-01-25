
import { CustomCommand } from "../../core/structures/commands/Command";
export default class TestCommand extends CustomCommand {

    /**
     *
     */
    constructor() {
        super({
            id: 'util.owner.test',
            options: {
                aliases: ['test'],
                ownerOnly: true,
                args: [{
                    id: 'guild',
                    default: null,
                    type: 'guild'
                }]
            }
        });

    }


    public async run(): Promise<unknown> {
        return;
    }
}