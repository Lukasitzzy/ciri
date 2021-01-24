import fetch, { Response, } from 'node-fetch';
import { ClientInteractionWS } from '../ClientInteractionWS';
import { IApplicationCommand } from '../types';
export class PartialInteractionCommand { }
// custom type for the return of fetch(...data).
interface IResponse<T> extends Response {
    json(): Promise<T>;
}



export class InteractionCommandManager {

    private readonly $ws: ClientInteractionWS;

    /**
     *
     */
    constructor(ws: ClientInteractionWS) {
        this.$ws = ws;

    }


    async createCommand(): Promise<void> {
        //
    }

    public async deleteCommand({
        commandID,
        guildID
    }: {
        commandID: string;
        guildID?: string;
    }): Promise<void> {
        //

    }


    public async updateCommand({
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
    }): Promise<void> {
        //
    }

    public async getGuildCommands({ guildID }: { guildID: string; }): Promise<IApplicationCommand[]> {
        return this.$fetchCommands(guildID);
    }

    public async getGlobalCommands(): Promise<IApplicationCommand[]> {
        return this.$fetchCommands();
    }


    private async $fetchCommands(guildID?: string) {
        const data = { guildID };
        return (await this.makeRequest<IApplicationCommand[]>({ method: 'GET', data })).json();
    }



    async makeRequest<
        T extends unknown,
        Body extends Record<string, unknown> = Record<string, unknown>
    >({ method, data }: { method: 'POST' | 'DELETE' | 'PATCH' | 'GET'; data: Body; }): Promise<IResponse<T>> {


        const URL = data.guildID ?
            `ttps://discord.com/api/v8/applications/${this.$ws.client.user?.id}/guilds/${data.guildID}/commands` :
            `https://discord.com/api/v8/applications/${this.$ws.client.user?.id}/commands`;
        const options: Record<string, any> = {
            headers: {
                Authorization: `Bot ${this.$ws.client.token}`
            }
        };

        switch (method) {
            case 'POST':
                options.method = 'POST';
                options.body = JSON.stringify(data.data);
                break;

            default:
                break;
        }

        return fetch(URL, options);

    }

}