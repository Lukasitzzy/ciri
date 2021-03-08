
export const EMOTES = {
    DEFAULT: {
        'settings.automod.spam': '🍖',
        'settings.disabled': '🔴',
        'settings.enabled': '🟢',
        'settings.paused':'⚫',
        error: '❌',
        loading: '⏳',
        success: '✅'
    },
    CUSTOM: {
        'settings.automod.spam': '<:SPAM:818024711224164372>',
        'settings.disabled': '<:disabled:764431350706995221>',
        'settings.enabled': '<:AloyEnabled:781095223005806615>',
        'settings.paused':'<:paused:818033976974639125>',
        error: '<:AloyError:781095223148412933>',
        loading: '<a:loading_2:817816589831241738',
        success: '<:AloySuccess:781095252269727775>'
    }
} as const;

export const DefaultDatabaseConfig = {
    auth: undefined,
    dbname: 'discord_bot',
    host: 'localhost',
    port: 27017,
    appname: 'ciri discord bot',

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
