

export type valueOf<T> = T[keyof T];


export interface DatabaseOptions {
    host: string;
    port: number;
    appname?: string;
    auth?: {
        user: string;
        password: string;
    };
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
    dbname: string;
    shards: number[];
}


export interface CommandDescription {

    text: string;
    aliases: string[];
    examples: string[];
    usage: string[]
}
