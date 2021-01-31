export const ERROR_MESSAGES = {

    INVALID_COMMAND_ID: (commandID: string, guild?: string): string =>
        `the command with the id "${commandID}" does not exist${guild ? `on guild "${guild}".` : '.'}`,
    INVALID_OPTION_TYPE: (command: string, option: string, got: string, wanted: string): string =>
        `the option "${option}" for the command "${command}" is invalid, got "${got}"  but wanted "${wanted}".`,
    INVALID_ENDPOINT: (endpoint: string, endpoints: string[]): string =>
        `the endpoint "${endpoint}" is not valid. Valid ones includes: ${endpoints.join('. ')} `
};