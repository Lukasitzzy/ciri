
interface BaseSettings {
    _id: never;
    __v: never;
}

export interface IGuildSettings extends BaseSettings {
    /**
     * @required
     */
    guild_id: string;
    /**
     * @default_value true
     */
    allow_slash_commands: boolean;
}
