import { Client, TextChannel } from 'discord.js';
import WOKCommands from 'wokcommands';
import { isWebUri } from 'valid-url';
import { extract } from 'article-parser';
import { articleParserMockResponse } from '../test-data/article-parser';
import ArticlePostsSchema from '../models/article-posts';

const articleBotChannel = process.env.NODE_ENV === 'production' ? 'article-bot' : 'article-bot-test';

export default (client: Client, instance: WOKCommands) => {
	client.on('message', async (message) => {
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

		const urlFromPost = message.content.split(' ').find(isWebUri);
		if (!urlFromPost) {
			return;
		}

		const { url, title, description, links, image, author, source, published, ttr, content } = await extract(
			urlFromPost
		);

		// Uncomment to use test data:
		// const { url, title, description, links, image, author, source, published, ttr, content } = articleParserMockResponse;

		const articleBotMessage = await channel.send({
			embeds: [
				{
					color: '#ffaa00',
					title,
					url,
					description,
					timestamp: new Date(),
					author: {
						name: 'Publisher Name',
					},
					image: {
						url: image,
					},
					fields: [
						{
							name: 'Authors',
							value: author ?? 'Unknown',
						},
						{
							name: 'Reading time',
							value: ttr ? `${Math.floor(ttr / 60)} minutes` : 'Unknown',
						},
					],
					// footer: {
					//   text:
					// }
				},
			],
		});

		ArticlePostsSchema.create({
			title,
			authors: author,
			// publisher: '',
			url,
			submitter: message.author.id,
			votes: 0,
			submissionMessageId: message.id,
			articleBotMessageId: articleBotMessage.id,
		});
	});
};

const config = {
	displayName: 'Post article',
	dbName: 'POST ARTICLE',
};

export { config };
