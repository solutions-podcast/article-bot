import DiscordJS, { ButtonInteraction, TextChannel } from 'discord.js';
import ArticlePostsSchema from './models/article-posts';

const voteCollectorInit = (channel: TextChannel) => {
	const voteCollector = channel.createMessageComponentCollector({});

	voteCollector.on('collect', async (i: ButtonInteraction) => {
		console.log('collect');
		i.reply({
			content: 'You clicked a button...',
		});
		try {
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
		} catch (error) {
			console.error('Could not find post in db');
		}
	});
};

const collectors = [
	{
		channelName: process.env.NODE_ENV === 'production' ? 'article-bot' : 'article-bot-test',
		init: voteCollectorInit,
	},
];

export function setupCollectors(client: DiscordJS.Client) {
	client.guilds.cache.forEach((guild) => {
		collectors.forEach(({ channelName, init }) => {
			const channel = guild.channels.cache.find((channel) => channel.name === channelName) as TextChannel;
			init(channel);
		});
	});
}
