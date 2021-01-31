import { IApplicationCommand, IWsResponseDataOptions } from '../types';
/**
 * a helper class for 
 */
export class ApplicationCommand {
    /**
     * 
     */
    application: string;

    id: string;
    name: string;
    options?: IWsResponseDataOptions[];
    constructor(data: IApplicationCommand) {

        this.application = data.application_id;
        this.name = data.name;

        this.id = data.id;
        this.options = data.options;

    }
} 