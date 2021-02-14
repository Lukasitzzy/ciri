

export interface Api {
    guilds: GuildsApi;
}

export interface GuildsApi {
    (guildID: string): GuildApi;
}
export interface GuildApi {
    commands: CommandApi;
}
type CommandApi = commandsApi | MethodApi<any, { data: any; }>;

interface MethodApi<T, data> {
    get(): Promise<T>;
    patch(data: data): Promise<T>;
    delete(): Promise<T>;
}


export interface commandsApi {
    (commandID: string): {
        get(): Promise<any>;
        patch(): Promise<any>;
        delete(): Promise<any>;
    };
}