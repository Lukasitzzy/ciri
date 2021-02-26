const discord = require('discord.js');
const c = new discord.Client( { intents: discord.Intents.ALL });
const clientID = process.env.DISCORD_CLIENT_ID;
if (clientID) {
	c.api.applications(clientID).commands("410488579140354049").get().catch(err => {
		console.log(err);
	})

}
