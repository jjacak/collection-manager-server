require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const {
	getUsers,
	deleteUser,
	blockUser,
	assignRoles,
	deleteRoles,
	updateMetadata,
	getUserById,
} = require('./routes/admin-routes');
const {
	createCollection,
	getCollections,
	getCollectionById,
	addItem,
	getLargestCollections,
	getNewestItems,
	deleteCollections,
	deleteItemById,
	editCollection,
	deleteImage,
	editImage,
	editItem,
} = require('./routes/user-routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI);

app.use(getUsers);
app.use(deleteUser);
app.use(blockUser);
app.use(assignRoles);
app.use(deleteRoles);
app.use(updateMetadata);
app.use(getUserById);
app.use(createCollection);
app.use(getCollections);
app.use(getCollectionById);
app.use(addItem);
app.use(getLargestCollections);
app.use(getNewestItems);
app.use(deleteCollections);
app.use(deleteItemById);
app.use(editCollection);
app.use(deleteImage);
app.use(editImage);
app.use(editItem);

app.use((err, req, res, next) => {
	console.log(err.message);
	res.status(500).json({
		msg: err.message,
	});
});

const port = process.env.PORT || 5500;
app.listen(port, () => {
	console.log('server running on ', port);
});

module.exports = app;
