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
}


function checkENV() {
	ass.ok(
		process.env.DISCORD_TOKEN !== '',
		new Error
	)

}

main().catch(error => {

});
