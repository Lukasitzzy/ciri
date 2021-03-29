import { Snowflake } from 'discord.js';

interface IBaseSettings {
    _id?: undefined;
    __v?: undefined;
}

export interface IGuildSettings extends IBaseSettings {
    /**
     * @required
     */
    guild_id: string;
    /**
     * @default_value true
     */
    allow_slash_commands: boolean;
}


export interface ISlashCommandGuildPermissions extends IBaseSettings {
    guild_id: string;
    slash_command:string;
    roles: Snowflake[];
    members: Snowflake[];
    channels: Snowflake[];
    enable: boolean;
    //always false for now
    use_language_model: boolean;
}
