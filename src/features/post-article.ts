import {
	ButtonInteraction,
	Client,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	MessageEmbedOptions,
	TextChannel,
} from 'discord.js';
import WOKCommands from 'wokcommands';
import { isWebUri } from 'valid-url';
import { ArticleData, extract } from 'article-parser';
import { articleParserMockResponse } from '../test-data/article-parser';
import ArticlePostsSchema, { ArticlePost } from '../models/article-posts';
import { createArticleEmbeds } from '../helpers/article-formatting';
import { getByUrl } from 'mbfc-node';
import { readFile } from 'fs/promises';
import path from 'path';

const articleBotChannelName = process.env.NODE_ENV === 'production' ? 'article-bot' : 'article-bot-test';

export default (client: Client, instance: WOKCommands) => {
	client.on('messageCreate', async (message) => {
		if (message.author.bot) {
			return;
		}
		const { guild } = message;
		if (!guild) {
			return;
		}

		const channel = guild.channels.cache.find((channel) => channel.name === articleBotChannelName) as TextChannel;
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

		const mbfcData = JSON.parse((await readFile(path.join('cache', 'mbfc-data.json'))).toString());

		const mbfcResult = getByUrl(urlFromPost, mbfcData);

		// Uncomment to use test data:
		// const { url, title, description, links, image, author, source, published, ttr, content } = articleParserMockResponse;

		if (!title || !url) {
			throw new Error('Invalid article data');
		}

		const article: ArticlePost = {
			title,
			description,
			image,
			content,
			readingTimeSeconds: ttr,
			authors: author ? [author] : [],
			publisher: 'Publisher name',
			url,
			submitter: message.author.id,
			votes: [],
			submissionMessageId: message.id,
			mbfcResult: mbfcResult,
		};

		const buttons = new MessageActionRow().addComponents(
			new MessageButton().setCustomId('article-vote').setLabel('Toggle Vote').setStyle('SUCCESS')
		);

		const articleBotMessage = await channel.send({
			components: [buttons],
			embeds: await createArticleEmbeds(article, []),
		});
		article.articleBotMessageId = articleBotMessage.id;

		ArticlePostsSchema.create(article);
	});
};

const config = {
	displayName: 'Post article',
	dbName: 'POST ARTICLE',
};

export { config };
