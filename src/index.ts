import { DiscordBotClient } from "./core/client/Client";

const ROOT = __dirname;

const client = new DiscordBotClient(ROOT);


async function  start() {
    await client.start();
}


start().catch(error => {
    if (error) {
        console.error(`error on boot ${error}`);
        
    }
});