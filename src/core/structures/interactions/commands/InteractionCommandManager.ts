import { ClientInteractionWS } from '../ClientInteractionWS';
import { IApplicationCommand } from '../types';
import { EventEmitter } from 'events';

export class InteractionCommandHandler extends EventEmitter {

    private readonly $ws: ClientInteractionWS;

    constructor(ws: ClientInteractionWS) {
        super({ captureRejections: true });
        this.$ws = ws;

    }

    async create({ name, description, guildID }: { name: string; description: string; guildID?: string; }): Promise<IApplicationCommand | null> {

        const res = await this.makeRequest<IApplicationCommand>({
            method: 'post',
            data: {
                description,
                name,
                guildID
            }
        });
        return res.json();
    }

    public async update({
        commandid,
        data
    }: {
        commandid: string;
        data: {
            guildID?: string;
            data: {
                name: string;
                description: string;
                options: IApplicationCommand['options'][];
            };
        };
    }): Promise<IApplicationCommand> {

        return this.makeRequest<IApplicationCommand, typeof data>({
            method: 'patch',
            commandID: commandid,
            data
        }).then(res => res.json());
    }

    public async getCommandsForGuild({ guildID }: { guildID: string; }): Promise<IApplicationCommand[]> {
        if (!guildID) return [];
        return this.$fetchCommands(guildID);
    }

    public async getGlobalCommands(): Promise<IApplicationCommand[]> {
        return this.$fetchCommands();
    }


    private async $fetchCommands(guildID?: string) {
        const data = { guildID };
        return this.makeRequest<IApplicationCommand[], { guildID?: string; }>({
            method: 'get', data
        });
    }

    async makeRequest<
        T extends unknown,
        Body extends Record<string, unknown> = Record<string, unknown>
    >({ method, data, commandID }: { method: 'post' | 'delete' | 'patch' | 'get'; data: Body & { guildID?: string; }; commandID?: string; }): Promise<any> {


        data = data || {} as Body;
        const options: Record<string, any> = {
            headers: {
                Authorization: `Bot ${this.$ws.client.token}`,
                ['Content-Type']: 'application/json'
            }
        };

        switch (method) {
            case 'post':
                options.method = method;
                options.body = JSON.stringify(data);
                break;
            case 'get':
                options.method = method;
                break;

            case 'patch':
                options.method = method;
                options.body = JSON.stringify(data);
        }
        return this.$ws[method]();

    }

}