import DiscordJS, { ButtonInteraction, TextChannel } from 'discord.js';
import ArticlePostsSchema from '../models/article-posts';

const articleBotChannelName = process.env.NODE_ENV === 'production' ? 'article-bot' : 'article-bot-test';
const channel = guild.channels.cache.find((channel) => channel.name === articleBotChannelName) as TextChannel;

const voteCollector = channel.createMessageComponentCollector({});

voteCollector.on('collect', async (i: ButtonInteraction) => {
	await ArticlePostsSchema.findOneAndUpdate(
		{
			articleBotMessageId: i.message.id,
		},
		{
			$addToSet: { votes: i.user.id },
		}
	);

	const unvoteCollector = channel.createMessageComponentCollector({});

	unvoteCollector.on('collect', async (i: ButtonInteraction) => {
		await ArticlePostsSchema.findOneAndUpdate(
			{
				articleBotMessageId: i.message.id,
			},
			{
				$pull: { votes: i.user.id },
			}
		);
	});
});
