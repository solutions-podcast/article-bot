import DiscordJS, { ButtonInteraction, Client, TextChannel } from 'discord.js';
import { createArticleEmbeds } from './helpers/article-formatting';
import ArticlePostsSchema from './models/article-posts';

const voteCollectorInit = (channel: TextChannel, client: Client) => {
	const voteCollector = channel.createMessageComponentCollector({});

	voteCollector.on('collect', async (i: ButtonInteraction) => {
		if (i.customId !== 'article-vote') {
			return;
		}
		try {
			const article = await ArticlePostsSchema.findOne({ articleBotMessageId: i.message.id });
			if (article && article.votes) {
				const updatePayload = article.votes.includes(i.user.id)
					? {
							$pull: { votes: i.user.id },
					  }
					: {
							$addToSet: { votes: i.user.id },
					  };

				await ArticlePostsSchema.findOneAndUpdate(
					{
						articleBotMessageId: i.message.id,
					},
					updatePayload
				);

				const updatedArticle = await ArticlePostsSchema.findOne({ articleBotMessageId: i.message.id });
				i.update({ embeds: await createArticleEmbeds(article, updatedArticle.votes, client) });
			}
		} catch (error) {
			console.error('Could not find post in db');
		}
	});
};

const collectors = [
	{
		channelName: process.env.NODE_ENV === 'production' ? 'article-bot' : 'article-bot-test',
		init: voteCollectorInit,
		buttons: {
			// vote
		},
	},
];

export function setupCollectors(client: DiscordJS.Client) {
	client.guilds.cache.forEach((guild) => {
		collectors.forEach(({ channelName, init }) => {
			const channel = guild.channels.cache.find((channel) => channel.name === channelName) as TextChannel;
			init(channel, client);
		});
	});
}
