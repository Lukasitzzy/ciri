import { DiscordBot } from '../packages/core/src/client/Client';
const client = new DiscordBot(__dirname);
client.start().catch(e => client.logger.error(e));
