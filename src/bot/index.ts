import { AitherBot } from '../packages/core/src/client/Client';
const client = new AitherBot(__dirname);
client.start().catch(e => client.logger.error(e));

process.on('unhandledRejection', (res) => {
    if (res instanceof Error) {
        client.logger.error(res, 'Promise-rejection');
    } else {
        client.logger.error(new Error('promise rejection with no data'));
    }
});
