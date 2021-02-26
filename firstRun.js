const {
	Client, Intents
} = require('discord.js');
const ass = require('assert');
class ENVError extends Error {

}
async function main() {
	checkENV();

	const client = new Client({
		intents: Intents.ALL,
	});

	await client.api.applications(process.env.DISCORD_CLIENT_ID)
		.commands.put({
			data: require('./commands.json')
		});

}


function checkENV() {
	ass.ok(
		process.env.DISCORD_TOKEN !== undefined,
		new Error('no discord token in the enviromental vars found')
	);
	ass.ok(
		process.env.DISCORD_CLIENT_ID !== undefined,
		new Error('no client id found!')
	);
}

main().catch(error => {

});
