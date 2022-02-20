import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
	title: String,
	authors: [String],
	publisher: String,
	url: String,
	submitter: String,
	votes: Number,
	submissionMessageId: String,
	articleBotMessageId: String,
});

const name = 'article-posts';

export default mongoose.models[name] || mongoose.model(name, schema, name);
