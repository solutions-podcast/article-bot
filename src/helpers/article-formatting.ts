import { Client, MessageEmbedOptions } from 'discord.js';
import { ArticlePost } from '../models/article-posts';

export const createArticleEmbeds = async (
	article: ArticlePost,
	votes?: Array<string>,
	client?: Client
): Promise<Array<MessageEmbedOptions>> => {
	// links, source, published, content
	const { url, title, description, image, authors, readingTimeSeconds } = article;
	if (!title || !url) {
		throw new Error('Invalid article data');
	}
	let voteUsers: Array<unknown> = ['(none)']; // TODO: Figure out why this can't be Array<string>

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
			voteUsers = ['(none)'];
		}
	}

	const voteAmount = voteUsers[0] === '(none)' ? 0 : voteUsers.length;

	const embeds: Array<MessageEmbedOptions> = [
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
					value: authors.join(', ') ?? 'Unknown',
					inline: true,
				},
				{
					name: 'Reading time',
					value: readingTimeSeconds ? `${Math.floor(readingTimeSeconds / 60)} minutes` : 'Unknown',
					inline: true,
				},
				{
					name: `Votes (${voteAmount})`,
					value: voteUsers.join('\n'),
					inline: true,
				},
			],
			// footer: {
			//   text:
			// }
		},
	];

	if (embeds[0].fields !== undefined && article.mbfcResult) {
		const { bias, credibility, factualReporting, name, url } = article.mbfcResult;
		embeds[0].fields.push(
			...[
				{
					name: 'Publisher',
					value: name,
					inline: true,
				},
				{ name: '\u200B', value: '\u200B' },
				{
					name: 'Publisher Bias',
					value: bias,
					inline: true,
				},
				{
					name: 'Publisher Credibility',
					value: credibility,
					inline: true,
				},
				{
					name: 'Publisher Factual Reporting',
					value: factualReporting,
					inline: true,
				},
				{
					name: 'Publisher Media Bias Fact Check',
					value: url,
					inline: true,
				},
			]
		);
	}

	return embeds;
};
