import DiscordJS, { Intents } from 'discord.js';
import WOKCommands from 'wokcommands';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const client = new DiscordJS.Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', () => {
	console.log('The bot is ready');

	new WOKCommands(client, {
		commandsDir: path.join(__dirname, 'commands'),
		typeScript: process.env.NODE_ENV !== 'production',
		// testServers: process.env.DISCORD_TEST_SERVERS?.split(',') ?? [],
		mongoUri: process.env.MONGO_URI,
	});
});

client.login(process.env.DISCORD_BOT_TOKEN);
