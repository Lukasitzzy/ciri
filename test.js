const fetch = require('node-fetch');
require('dotenv').config();
const URL = `https://discord.com/api/v8/applications/761279062709764127/guilds/828610192211574874/commands`;

async function test() {
try {
    const headers = {
        Authorization: 'Bot ' + process.env.DISCORD_TOKEN,
        'Content-Type': 'application/json'
    };
    const res1 = await fetch(URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            name: 'test1',
            description: 'test123104',
            options: []
        })
    });

    if (res1.status >= 400) {
        console.log('failed request, ', res1.status);
        return;
    }
    const res = await res1.json();

    console.log(`created command with the id ${res.id}`);
    console.log('deleting it again...');
    const res2 = await fetch(URL + `/${res.id}`, {
        method: 'DELETE',
        headers,
    });

    if (res2.statusCode === 405 || res2.status === 405) {
        console.log('discord did return a 405');
        return;
    }
    console.log(res1, res, res2 );
    console.log('successfully deleted command');


} catch (error) {
    console.log(error.message);
}

}

test();
