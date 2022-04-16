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
import ArticlePostsSchema from '../models/article-posts';
import { createArticleEmbeds } from '../helpers/article-formatting';

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

		const article = await extract(urlFromPost);

		// Uncomment to use test data:
		// const article = articleParserMockResponse;

		const buttons = new MessageActionRow().addComponents(
			new MessageButton().setCustomId('article-vote').setLabel('Vote').setStyle('SUCCESS')
		);

		const articleBotMessage = await channel.send({
			components: [buttons],
			embeds: await createArticleEmbeds(article, []),
		});

		ArticlePostsSchema.create({
			title: article.title,
			authors: article.author,
			// publisher: '',
			url: article.url,
			submitter: message.author.id,
			votes: [],
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
