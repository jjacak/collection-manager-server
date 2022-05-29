const createCollection = require('express').Router();
const getCollections = require('express').Router();
const getCollectionById = require('express').Router();
const getLargestCollections = require('express').Router();
const getNewestItems = require('express').Router();
const getItem = require('express').Router();
const addItem = require('express').Router();
const deleteCollections = require('express').Router();
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const Collection = require('../models/collection.model');
const { checkJwt, editAccess } = require('../middleware/auth');

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

addItem.post('/add-item/:id', editAccess, async (req, res) => {
	try {
		const collection = await Collection.findOneAndUpdate(
			{ _id: req.params.id },
			{ $push: { items: req.body } }
		);
		res.send(collection);
	} catch (error) {
		res.status(500).send({ message: 'Failed to add item' });
	}
});

getLargestCollections.get('/get-largest-collections', async (req, res) => {
	try {
		const data = await Collection.aggregate([
			{ $unwind: '$items' },
			{ $group: { _id: '$_id', len: { $sum: 1 } } },
			{ $sort: { len: -1 } },
			{ $limit: 5 },
		]);
		collectionsId = data.map((c) => c._id);
		const collections = await Collection.find({ _id: { $in: collectionsId } });
		res.json(collections);
	} catch (error) {
		res.status(500).send({ message: 'Failed to get requested collections' });
	}
});

getNewestItems.get('/get-newest', async (req, res) => {
	try {
		const data = await Collection.aggregate([
			{
				$sort: {
					updatedAt: -1,
				},
			},
			{
				$project: {
					title: 1,
					items: { $slice: ['$items', -1] },
					owner_id: 1,
					owner_name: 1,
				},
			},
			{ $limit: 6 },
		]);
		const items = data.filter((c) => c.items.length > 0);
		res.json(items);
	} catch (error) {
		res.status(500).send({ message: 'Failed to get latest items.' });
	}
});

getItem.get('/get-item/:id', async (req, res) => {
	try {
		const data = await Collection.findOne({
			'items._id': req.params.id,
		});
		res.json(data);
	} catch (error) {
		console.log(error);
	}
});

deleteCollections.delete('/delete-collections/:id',editAccess, async (req, res) => {
	try {
		await Collection.deleteMany({
			$or: [{ _id: req.params.id }, { owner_id: req.params.id }],
		});
		res.send({ message: 'Collections deleted.' });
	} catch (error) {
		res.status(500).send({ message: 'Failed to delete collections.' });
	}
});

module.exports = {
	createCollection,
	getCollections,
	getCollectionById,
	addItem,
	getLargestCollections,
	getNewestItems,
	getItem,
	deleteCollections,
};
