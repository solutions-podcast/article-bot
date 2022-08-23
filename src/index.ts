import DiscordJS, { Intents } from 'discord.js';
import WOKCommands from 'wokcommands';
import path from 'path';
import axios from 'axios';
import { mkdirpSync, writeFileSync } from 'fs-extra';
import dotenv from 'dotenv';
dotenv.config();
import { setupCollectors } from './setup-collectors';

function downloadMbfcData() {
	axios.get('https://raw.githubusercontent.com/drmikecrowe/mbfcext/main/docs/v3/combined.json').then((res) => {
		if (!res.data || 'version' in res.data === false || 'date' in res.data === false) {
			console.error('Could not retrieve MBFC data');
		}
		mkdirpSync('cache');
		writeFileSync(path.join('cache', 'mbfc-data.json'), JSON.stringify(res.data));
	});
}

const client = new DiscordJS.Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', () => {
	console.log('The bot is ready');

	new WOKCommands(client, {
		commandsDir: path.join(__dirname, 'commands'),
		featuresDir: path.join(__dirname, 'features'),
		typeScript: process.env.NODE_ENV !== 'production',
		// testServers: process.env.DISCORD_TEST_SERVERS?.split(',') ?? [],
		mongoUri: process.env.MONGO_URI,
	});
	setupCollectors(client);
	downloadMbfcData();
});

client.login(process.env.DISCORD_BOT_TOKEN);
