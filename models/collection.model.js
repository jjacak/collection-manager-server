const mongoose = require('mongoose');

const Item = new mongoose.Schema({
	name: { type: String, required: true },
	tags: [{type: String}],
	author: { type: String, required: true },
	comments: [{ comment_author: String, comment_body: String }],
	likes: { type: Array },
});

const Collection = new mongoose.Schema(
	{
		owner_id: { type: String, required: true },
		tags: [{type: String}],
		title: { type: String, required: true },
		image: { type: String },
		cloudinary_id: { type: String },
		description: { type: String, required: true },
		topic: { type: String, required: true },
		items: [Item],
	},
	{ collection: 'collection-data', strict: false }
);
Collection.index({ 'items.$**': 'text' });

const model = mongoose.model('CollectionData', Collection);
module.exports = model;
