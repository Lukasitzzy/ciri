import { InteractionBase } from '../util/Interaction';
import { InterActionCommand } from './InteractionCommand';


export abstract class SlashCommand {

    private readonly _interaction!: InterActionCommand;

    public get client(): InteractionBase['client'] {
        return this._interaction.client;
    }

    public get interaction(): InterActionCommand {
        return this._interaction;
    }

    public abstract run(): void | Promise<void>;


}
