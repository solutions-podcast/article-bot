import { Client, TextChannel } from 'discord.js';
import WOKCommands from 'wokcommands';
import { isWebUri } from 'valid-url';

const articleBotChannel = process.env.NODE_ENV === 'production' ? 'article-bot' : 'article-bot-test';

export default (client: Client, instance: WOKCommands) => {
	client.on('message', (message) => {
		if (message.author.bot) {
			return;
		}
		const { guild } = message;
		if (!guild) {
			return;
		}

		const channel = guild.channels.cache.find((channel) => channel.name === articleBotChannel) as TextChannel;
		if (!channel) {
			return;
		}

		const url = message.content.split(' ').find(isWebUri);
		if (!url) {
			return;
		}

		channel.send({
			content: url,
		});
	});
};

const config = {
	displayName: 'Post article',
	dbName: 'POST ARTICLE',
};

export { config };
