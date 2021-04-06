export const VERSION = '0.69.420';
export const EMOTES = {
    DEFAULT: {
        default_member_boost: '❇',
        error: '❌',
        info: 'ℹ',
        loading:'⌛',
        member_idle: '🟨',
        member_online: '🟩',
        mobile_dnd: '🔴',
        mobile_idle: '🟡',
        mobile_online: '🟢',
        paused: '⏸',
        server_boost_level_0: '🌠',
        server_boost_level_1: '⭐',
        server_boost_level_2: '🌟',
        server_boost_level_3: '✨',
        server_community: '🌍',
        server_partnered: '',
        server_verified: '\\♋',
        settings_disabled: '🟢',
        settings_enabled: '🔴',
        success: '✅'
    },
    CUSTOM: {
        // i do NOT own any of the following emotes 
        // emotes images are owned by discord and all rights are kept
        // to them and i do not have any 'authorized' use of them.
        // i ONLY have the permissions to use the loading emote
        // since i did create it myself on a stechy website
        // please don't sue me discord thanks
        default_member_boost: '<:member_boost:828616412166619196>',
        error: '<:error:828614605352730685>',
        info: '<:info:828615222586507325>',
        loading: '<a:loading:828615360139493426>',
        member_idle: '<:idle:828614978952232991>',
        member_online: '<:online:828615170086404146>',
        mobile_dnd: '<:member_mobile_dnd:828616901809799180>',
        mobile_idle: '<:member_mobile_idle:828616743122763826>',
        mobile_online: '<:member_mobile_online:828616647710474261>',
        paused: '<:settings_pused:828617832065269781>',
        server_boost_level_0: '<:boost_level0:828615920049717328>',
        server_boost_level_1: '<:boost_level1:828615802084261958>',
        server_boost_level_2: '<:boost_level2:828615687702315098>',
        server_boost_level_3: '<:boost_level3:828615545548308560>',
        server_community: '<:server_community:828616326393495582>',
        server_partnered: '<a:server_partnered:828616175297626113>',
        server_verified: '<:server_verified:828616125850845245>',
        settings_disabled: '<:disabled:828615476183302165>',
        settings_enabled: '<:enabled:828615984687349761>',
        success: '<:success:828614918688604191>',
    }
} as const;

export const DefaultDatabaseConfig = {
    auth: undefined,
    dbname: 'discord_bot',
    host: 'localhost',
    port: 27017,
    appname: 'christina discord bot',

} as const;

export const AllowedCollectionNames = {
    GlobalBlacklist: 'global.blacklist',
    GuildBlacklist: 'guild.blacklist',
    GuildEconomy: 'guild.economy',
    GuildSettings: 'guild.settings',
    GuildSlashCommands: 'guild.slash_commands',
    GuildTags: 'guild.tags',
    UserSettings: 'user.settings',
    UserTags: 'user.tags'
    
} as const;
