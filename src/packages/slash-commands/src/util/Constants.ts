import { Permissions } from 'discord.js';

export const InteractionCommandOptionType = {
    SUB_COMMAND: 1,
    SUB_COMMAND_GROUP: 2,
    STRING: 3,
    INTEGER: 4,
    BOOLEAN: 5,
    USER: 6,
    CHANNEL: 7,
    ROLE: 8,
};

export const InteractionType = {
    PING: 1,
    APPLICATION_COMMAND: 2,
};

export const invertedInteractionType = {
    1: 'PING',
    2: 'APPLICATION_COMMAND'
};

export const InteractionResponseType = {
    PONG: 1,
    /**
     * @deprecated
     */
    ACKNOWLEDGE: 2,
    /**
     * @deprecated
     */
    CHANNEL_MESSAGE: 3,
    CHANNEL_MESSAGE_WITH_SOURCE: 4,
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
};
export const PermissionStrings = {
    ...Permissions.FLAGS,
    USE_APPLICATION_COMMANDS: 2147483648n
};
