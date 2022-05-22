const createCollection = require('express').Router();
const getCollections = require('express').Router();
const getCollectionById = require('express').Router();
const addItem = require('express').Router();
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const Collection = require('../models/collection.model');
const { checkJwt } = require('../middleware/auth');

createCollection.post(
	'/create-collection',
	checkJwt,
	upload.single('image'),
	async (req, res) => {
		let result;
		try {
			if (req.file !== undefined) {
				result = await cloudinary.uploader.upload(req.file.path);
			}
			let collection = await Collection.create({
				owner_id: req.body.owner_id,
				owner_name: req.body.owner_name,
				tags: JSON.parse(req.body.tags),
				title: req.body.title,
				topic: req.body.topic,
				description: req.body.description,
				image: result ? result.secure_url : null,
				cloudinary_id: result ? result.public_id : null,
			});
			res.json(collection);
		} catch (error) {
			res.status(500).send({
				message: 'Creating collection failed',
			});
		}
	}
);

getCollections.get('/get-collections/:id', async (req, res) => {
	try {
		const data = await Collection.find({ owner_id: req.params.id });
		res.json(data);
	} catch (error) {
		res.status(500).send({
			message: 'Failed to find requested collections',
		});
	}
});

getCollectionById.get('/get-collection/:id', async (req, res) => {
	try {
		const data = await Collection.find({ _id: req.params.id });
		res.json(data);
	} catch (error) {
		res.status(500).send({
			message: 'Failed to find requested collection',
		});
	}
});

addItem.post('/add-item/:id', async (req, res) => {
	try {
		const collection= await Collection.findOneAndUpdate({ _id: req.params.id }, { $push: { items: req.body  } });
		res.send(collection)
	} catch (error) {
		res.status(500).send({ message: 'Failed to add item' });
	}
});

module.exports = {
	createCollection,
	getCollections,
	getCollectionById,
	addItem,
};
