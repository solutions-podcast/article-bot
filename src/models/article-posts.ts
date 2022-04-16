import mongoose, { Schema } from 'mongoose';

export interface ArticlePost {
	title: string;
	description?: string;
	image?: string;
	content?: string;
	readingTimeSeconds?: number;
	authors: Array<string>;
	publisher: string;
	url: string;
	submitter: string;
	votes: Array<string>;
	submissionMessageId: string;
	articleBotMessageId?: string;
}

const schema = new Schema<ArticlePost>({
	title: String,
	description: String,
	image: String,
	content: String,
	readingTimeSeconds: Number,
	authors: [String],
	publisher: String,
	url: String,
	submitter: String,
	votes: [String],
	submissionMessageId: String,
	articleBotMessageId: String,
});

const name = 'article-posts';

export default mongoose.models[name] || mongoose.model(name, schema, name);
