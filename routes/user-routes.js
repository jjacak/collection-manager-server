const createCollection = require('express').Router();
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const Collection = require('../models/collection.model');

createCollection.post(
	'/create-collection',
	upload.single('image'),
	async (req, res) => {
		try {
			const result = await cloudinary.uploader.upload(req.file.path);
			let collection = new Collection({
				owner_id: req.body.id,
				tags: req.body.tags,
				title: req.body.title,
				topic: req.body.topic,
				description: req.body.description,
				image: result.secure_url,
				cloudinary_id: result.public_id,
			});
			await collection.save();
			res.json(collection);
		} catch (error) {
			res.json(error);
		}
	}
);

module.exports = { createCollection };
