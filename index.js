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
const { createCollection, getCollections } = require('./routes/user-routes');

const app = express();

const corsOptions = {
	origin: 'https://collection-manager.netlify.app/',
	optionsSuccessStatus: 200 
  }

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(
	process.env.MONGODB_URI || 'mongodb://localhost:27017/collection-manager'
);

app.use(getUsers);
app.use(deleteUser);
app.use(blockUser);
app.use(assignRoles);
app.use(deleteRoles);
app.use(updateMetadata);
app.use(getUserById);
app.use(createCollection);
app.use(getCollections);

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
