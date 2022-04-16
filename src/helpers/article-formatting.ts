import { ArticleData } from 'article-parser';
import { Client, MessageEmbedOptions } from 'discord.js';

export const createArticleEmbeds = async (
	article: ArticleData,
	votes?: Array<string>,
	client?: Client
): Promise<Array<MessageEmbedOptions>> => {
	const { url, title, description, links, image, author, source, published, ttr, content } = article;
	if (!title || !url) {
		throw new Error('Invalid article data');
	}
	let voteUsers: Array<unknown> = ['none']; // TODO: Figure out why this can't be Array<string>
	if (votes && client) {
		voteUsers = await Promise.all(
			votes.map((id) => {
				return new Promise((resolve, reject) => {
					client.users
						.fetch(id)
						.then((user) => resolve(user.username))
						.catch((err) => reject(err));
				});
			})
		);
		if (voteUsers.length === 0) {
			voteUsers = ['none'];
		}
	}

	return [
		{
			color: '#ffaa00',
			title,
			url,
			description,
			timestamp: Date.now(),
			author: {
				name: 'Publisher Name',
			},
			image: {
				url: image,
			},
			fields: [
				{
					name: 'Author(s)',
					value: author ?? 'Unknown',
				},
				{
					name: 'Reading time',
					value: ttr ? `${Math.floor(ttr / 60)} minutes` : 'Unknown',
				},
				{
					name: 'Votes',
					value: voteUsers.join('\n'),
				},
			],
			// footer: {
			//   text:
			// }
		},
	];
};
