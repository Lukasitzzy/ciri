import { InteractionBase } from '../util/Interaction';
import { InterActionCommand } from './InteractionCommand';


export abstract class SlashCommand {

    public name: string;
    constructor(name: string) {
        this.name = name;
    }

    public client!: InteractionBase['client'];


    public userPermissions?(interaction: InterActionCommand): boolean | Promise<boolean>;

    public clientPermissions?(interaction: InterActionCommand): boolean | Promise<boolean>;
    public abstract run(interaction: InterActionCommand): void | Promise<void>;


}
